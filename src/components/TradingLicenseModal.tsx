import React, { useMemo, useState, useRef } from 'react';
import { Download, Printer, Mail, Loader2, Check } from 'lucide-react';
import { TradingLicenseApplication } from '../types';
import { generateTradingLicensePDF } from '../utils/pdfGenerator';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import {
  AddisAbabaEmblem,
  TradeBureauLogo,
  BlueOfficialRubberStamp,
  OfficialSignatureSvg,
} from './OfficialLogos';
import {
  toEthiopianDate,
  formatGregorianDate,
  getSubCityAmharic,
  getRegionAmharic,
  getAmharicHonorific,
  getEnglishHonorific,
  getAmharicName,
  getOfficerNames,
  getFieldOfBusiness,
  formatOfficialLicenseNo,
  formatPrincipalRegNo,
} from '../utils/ethiopianLicenseFormat';

interface TradingLicenseModalProps {
  application: TradingLicenseApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onSendEmailCopy?: (email: string) => void;
}

const QR_SIZE = 21;

function qrModules(seed: string): boolean[][] {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const next = () => {
    hash ^= hash << 13;
    hash ^= hash >>> 17;
    hash ^= hash << 5;
    return (hash >>> 0) / 4294967295;
  };

  const zones: [number, number][] = [
    [0, 0],
    [0, QR_SIZE - 7],
    [QR_SIZE - 7, 0],
  ];

  const inFinder = (row: number, col: number) =>
    zones.some(([zr, zc]) => row >= zr && row < zr + 7 && col >= zc && col < zc + 7);

  const grid = Array.from({ length: QR_SIZE }, () =>
    Array.from({ length: QR_SIZE }, () => false)
  );

  for (let row = 0; row < QR_SIZE; row += 1) {
    for (let col = 0; col < QR_SIZE; col += 1) {
      if (!inFinder(row, col)) grid[row][col] = next() > 0.52;
    }
  }

  for (const [zr, zc] of zones) {
    for (let row = 0; row < 7; row += 1) {
      for (let col = 0; col < 7; col += 1) {
        const ring = row === 0 || row === 6 || col === 0 || col === 6;
        const core = row >= 2 && row <= 4 && col >= 2 && col <= 4;
        grid[zr + row][zc + col] = ring || core;
      }
    }
  }

  return grid;
}

const QrBlock: React.FC<{ seed: string }> = ({ seed }) => {
  const grid = useMemo(() => qrModules(seed), [seed]);

  return (
    <svg
      viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
      shapeRendering="crispEdges"
      className="h-[52px] w-[52px] shrink-0 border border-black bg-white p-0.5"
      role="img"
      aria-label={`Verification QR code for ${seed}`}
    >
      {grid.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#000000" />
          ) : null
        )
      )}
    </svg>
  );
};

export const TradingLicenseModal: React.FC<TradingLicenseModalProps> = ({
  application,
  isOpen,
  onClose,
  onSendEmailCopy,
}) => {
  const [emailSent, setEmailSent] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !application) return null;

  const ethDate = toEthiopianDate(application.issueDate || '2023-05-24');
  const gregDate = formatGregorianDate(application.issueDate || '2023-05-24');

  const officialLicenseNo = formatOfficialLicenseNo(application, ethDate.year);
  const principalRegNo = formatPrincipalRegNo(application, ethDate.year);
  const tinNumber = application.tinNumber || '0084495831';

  const photoDoc = application.documents.find((d) => d.type === 'owner_photo');
  const fieldOfBusiness = getFieldOfBusiness(application);
  const officerNames = getOfficerNames(application.assignedOfficerName);

  const isCompany =
    application.businessType === 'Private Limited Company (PLC)' ||
    application.businessType === 'Share Company (S.C.)' ||
    application.businessType === 'General Partnership';

  // Format Owner/Company Name
  const ownerNameAmharic = isCompany
    ? getAmharicName(application.tradeName)
    : getAmharicHonorific(application.gender, application.fullName);

  const ownerNameEnglish = isCompany
    ? application.tradeName
    : getEnglishHonorific(application.gender, application.fullName);

  // Nationality
  const nationalityAmharic = isCompany ? 'በኢትዮጵያ የተመዘገበ' : 'ኢትዮጵያዊ';
  const nationalityEnglish = isCompany ? 'Registered in Ethiopia' : 'Ethiopian';

  // Trade Name (Item 3): In Ethiopian trade licenses, if Item 1 is the Company Name, Item 3 is left blank
  const tradeNameAmharic = isCompany
    ? '----------------'
    : getAmharicName(application.tradeName) || '----------------';
  const tradeNameEnglish = isCompany
    ? '----------------'
    : application.tradeName || '----------------';

  // Manager Name
  const managerNameAmharic = getAmharicHonorific(application.gender, application.fullName);
  const managerNameEnglish = getEnglishHonorific(application.gender, application.fullName);

  // Address
  const regionAmharic = getRegionAmharic(application.region);
  const subCityAmharic = getSubCityAmharic(application.subCity);
  const regionEnglish = application.region || 'Addis Ababa';
  const subCityEnglish = application.subCity || 'Kirkos';
  const woredaVal = application.woreda || '10';
  const houseNoVal = application.houseNumber || '313';
  const phoneVal = application.phone || '0930069347';
  const emailVal = application.email || '-----';

  // Capital formatted
  const formattedCapital = (application.capital || 100000).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateTradingLicensePDF(application, documentRef.current);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleEmailCopy = () => {
    onSendEmailCopy?.(application.email);
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      title="የንግድ ሥራ ፈቃድ / Business License"
      subtitle={`የንግድ ሥራ ፈቃድ ቁጥር: ${officialLicenseNo}`}
      flushBody
      headerActions={
        <>
          <Button
            variant="primary"
            size="sm"
            disabled={isGeneratingPdf}
            icon={
              isGeneratingPdf ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )
            }
            onClick={handleDownloadPdf}
          >
            {isGeneratingPdf ? 'Generating...' : 'PDF'}
          </Button>
          <Button
            size="sm"
            icon={emailSent ? <Check className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
            onClick={handleEmailCopy}
          >
            {emailSent ? 'Sent' : 'Email'}
          </Button>
          <Button
            size="sm"
            icon={<Printer className="h-3.5 w-3.5" />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </>
      }
    >
      {/* Background canvas container for preview */}
      <div className="trading-license-canvas overflow-x-auto bg-slate-200/80 p-3 sm:p-6 flex justify-center print:bg-white print:p-0 print:m-0">
        {/* =========================================================================
            OFFICIAL TRADING LICENSE DOCUMENT (Exact 1-Page A4 Replica)
            ========================================================================= */}
        <div
          ref={documentRef}
          id="trading-license-document"
          data-print-root
          className="relative w-[780px] max-w-[780px] bg-white px-8 py-6 text-black shadow-xl font-sans print:shadow-none print:m-0 print:p-0 print:w-[210mm] print:max-w-[210mm] print:h-[297mm] print:max-h-[297mm] print:overflow-hidden flex flex-col justify-between"
          style={{
            fontFamily:
              '"Noto Sans Ethiopic", "Nyala", "Abyssinica SIL", "Plus Jakarta Sans", sans-serif',
          }}
        >
          {/* ---- HEADER ---- */}
          <div>
            <header className="flex items-center justify-between gap-4">
              <AddisAbabaEmblem size={56} />
              <div className="text-center flex-1">
                <h1 className="text-[18px] font-extrabold tracking-normal text-black leading-tight">
                  በአዲስ አበባ ከተማ አስተዳደር ንግድ ቢሮ
                </h1>
                <h2 className="text-[15px] font-bold text-black leading-tight mt-0.5">
                  Addis Ababa City Administration Trade Bureau
                </h2>
              </div>
              <TradeBureauLogo size={56} />
            </header>

            <hr className="my-1.5 border-t-[1.5px] border-black" />

            {/* ---- TOP SECTION: PHOTO (LEFT) + METADATA TABLE (RIGHT) ---- */}
            <div className="grid grid-cols-[115px_1fr] gap-5 items-start my-1.5">
              {/* Passport Photo with Overlapping Stamp */}
              <div className="relative w-[104px] h-[128px] border border-slate-400 bg-slate-100 flex items-center justify-center overflow-visible">
                <div className="w-full h-full overflow-hidden bg-[#2563eb] flex items-center justify-center">
                  {photoDoc?.previewUrl ? (
                    <img
                      src={photoDoc.previewUrl}
                      alt={application.fullName}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white">
                      <svg viewBox="0 0 24 24" className="w-14 h-14 fill-current opacity-80">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Blue Rubber Stamp Overlapping Photo */}
                <BlueOfficialRubberStamp
                  size={105}
                  rotation={-12}
                  className="absolute -bottom-6 -right-6 z-10 opacity-90"
                />
              </div>

              {/* Structured 6-Row Meta Table */}
              <div className="border border-black text-[10px] leading-tight ml-50">
                {/* Row 1: TIN */}
                <div className="grid grid-cols-[150px_1fr] border-b border-black">
                  <div className="py-0.5 px-2 font-semibold text-black border-r border-black">
                    የግብር ከፋይ መለያ ቁ. /TIN
                  </div>
                  <div className="py-0.5 px-2 text-center font-mono font-medium tracking-wide">
                    {tinNumber}
                  </div>
                </div>

                {/* Row 2: Principal Registration */}
                <div className="grid grid-cols-[150px_1fr] border-b border-black">
                  <div className="py-0.5 px-2 font-semibold text-black border-r border-black">
                    <div>የንግድ ምዝገባ ቁ.</div>
                    <div className="text-[9px] text-slate-700">Principal Registration No.</div>
                  </div>
                  <div className="py-0.5 px-2 text-center font-mono font-medium tracking-wide">
                    {principalRegNo}
                  </div>
                </div>

                {/* Row 3: Previous License No */}
                <div className="grid grid-cols-[150px_1fr] border-b border-black">
                  <div className="py-0.5 px-2 font-semibold text-black border-r border-black">
                    <div>የቀድሞው ንግድ ፈቃድ ቁጥር</div>
                    <div className="text-[9px] text-slate-700">Previous License No.</div>
                  </div>
                  <div className="py-0.5 px-2 text-center text-slate-400">
                    ----------------
                  </div>
                </div>

                {/* Row 4: Business License No */}
                <div className="grid grid-cols-[150px_1fr] border-b border-black">
                  <div className="py-0.5 px-2 font-semibold text-black border-r border-black">
                    <div>የንግድ ሥራ ፈቃድ ቁጥር</div>
                    <div className="text-[9px] text-slate-700">Business License No.</div>
                  </div>
                  <div className="py-0.5 px-2 text-center font-mono font-bold tracking-wide">
                    {officialLicenseNo}
                  </div>
                </div>

                {/* Row 5: Previous Date */}
                <div className="grid grid-cols-[150px_1fr] border-b border-black">
                  <div className="py-0.5 px-2 font-semibold text-black border-r border-black">
                    <div>ቀድሞ ተሰጠበት ቀን</div>
                    <div className="text-[9px] text-slate-700">Previous Date of issuance</div>
                  </div>
                  <div className="py-0.5 px-2 text-center text-slate-400">
                    ----------------
                  </div>
                </div>

                {/* Row 6: Date of issuance */}
                <div className="grid grid-cols-[150px_1fr]">
                  <div className="py-0.5 px-2 font-semibold text-black border-r border-black">
                    <div>የተሰጠበት ቀን</div>
                    <div className="text-[9px] text-slate-700">Date of issuance</div>
                  </div>
                  <div className="py-0.5 px-2 text-center font-mono font-bold">
                    {ethDate.formatted}
                  </div>
                </div>
              </div>
            </div>

            {/* ---- TITLE SECTION ---- */}
            <div className="grid grid-cols-2 gap-4 my-1.5 text-black">
              <div className="text-left">
                <h3 className="text-[16px] font-extrabold leading-tight">
                  የንግድ ሥራ ፈቃድ
                </h3>
                <p className="text-[10px] font-bold mt-0.5 leading-tight">
                  በንግድ ምዝገባና ፈቃድ አዋጅ ቁጥር 980/2008 መሰረት ተሰጠ
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-[16px] font-extrabold leading-tight">
                  Business License
                </h3>
                <p className="text-[10px] font-bold mt-0.5 leading-tight">
                  Issued Under Commercial Registration and Business license proc.No 980/2016
                </p>
              </div>
            </div>

            <hr className="my-1 border-t border-black" />

            {/* ---- MAIN BILINGUAL TWO-COLUMN BODY WITH DASHED CENTER DIVIDER ---- */}
            <div className="grid grid-cols-2 text-[10.5px] leading-tight gap-x-4">
              {/* ===================== LEFT COLUMN (AMHARIC) ===================== */}
              <div className="pr-3 border-r border-dashed border-black flex flex-col gap-1.5">
                {/* 1. Name */}
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold shrink-0">1. የግለሰቡ/ድርጅቱ ስም</span>
                  <span className="font-bold underline underline-offset-2 flex-1 truncate">
                    {ownerNameAmharic}
                  </span>
                </div>

                {/* 2. Nationality */}
                <div className="flex items-baseline justify-between border-b border-black pb-0.5">
                  <span className="font-bold">2. ዜግነት</span>
                  <span className="font-semibold">{nationalityAmharic}</span>
                </div>

                {/* 3. Trade Name */}
                <div className="flex items-baseline justify-between border-b border-black pb-0.5">
                  <span className="font-bold">3. የንግድ ስም</span>
                  <span className="font-medium text-slate-700">
                    {tradeNameAmharic}
                  </span>
                </div>

                {/* 4. General Manager */}
                <div className="flex items-baseline justify-between border-b border-black pb-0.5">
                  <span className="font-bold">4. ሥራ አስኪያጅ ስም</span>
                  <span className="font-bold">{managerNameAmharic}</span>
                </div>

                {/* 5. Address */}
                <div>
                  <span className="font-bold block">5. የንግድ ድርጅቱ አድራሻ</span>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-0.5 text-[9.5px]">
                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">ክልል</span>
                      <span className="font-semibold ml-auto">{regionAmharic}</span>
                    </div>
                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">ዞን/ክፍለ ከተማ</span>
                      <span className="font-semibold ml-auto">{subCityAmharic}</span>
                    </div>

                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">ወረዳ</span>
                      <span className="font-mono ml-auto">{woredaVal}</span>
                    </div>
                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">ቀበሌ</span>
                      <span className="text-slate-400 ml-auto">-----</span>
                    </div>

                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">የቤት ቁጥር</span>
                      <span className="font-mono ml-auto">{houseNoVal}</span>
                    </div>
                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">ስልክ ቁጥር</span>
                      <span className="font-mono ml-auto">{phoneVal}</span>
                    </div>

                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">ፋክስ</span>
                      <span className="text-slate-400 ml-auto">-----</span>
                    </div>
                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">ኢ-ሜይል</span>
                      <span className="font-mono text-slate-800 ml-auto text-[9px] truncate max-w-[130px]">
                        {emailVal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. Field of Business */}
                <div>
                  <span className="font-bold block">6. የንግድ ሥራ መስክ</span>
                  <div className="mt-0.5 text-[9.5px] leading-snug border-b border-black pb-0.5 font-medium">
                    {fieldOfBusiness.amharic}
                  </div>
                </div>

                {/* 7. Capital */}
                <div className="flex items-baseline justify-between border-b border-black pb-0.5">
                  <span className="font-bold">7. ካፒታል በኢት ብር</span>
                  <span className="font-mono font-bold text-[11px]">{formattedCapital}</span>
                </div>
              </div>

              {/* ===================== RIGHT COLUMN (ENGLISH) ===================== */}
              <div className="pl-3 flex flex-col gap-1.5">
                {/* 1. Name */}
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold shrink-0">1. Owner/Company Name</span>
                  <span className="font-bold underline underline-offset-2 flex-1 truncate">
                    {ownerNameEnglish}
                  </span>
                </div>

                {/* 2. Nationality */}
                <div className="flex items-baseline justify-between border-b border-black pb-0.5">
                  <span className="font-bold">2. Nationality</span>
                  <span className="font-semibold">{nationalityEnglish}</span>
                </div>

                {/* 3. Trade Name */}
                <div className="flex items-baseline justify-between border-b border-black pb-0.5">
                  <span className="font-bold">3. Trade Name</span>
                  <span className="font-medium text-slate-700">
                    {tradeNameEnglish}
                  </span>
                </div>

                {/* 4. General Manager */}
                <div className="flex items-baseline justify-between border-b border-black pb-0.5">
                  <span className="font-bold">4. General Manager Name</span>
                  <span className="font-bold">{managerNameEnglish}</span>
                </div>

                {/* 5. Address */}
                <div>
                  <span className="font-bold block">5. Business Address</span>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-0.5 text-[9.5px]">
                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">Region</span>
                      <span className="font-semibold ml-auto">{regionEnglish}</span>
                    </div>
                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">Zone/Sub City</span>
                      <span className="font-semibold ml-auto">{subCityEnglish}</span>
                    </div>

                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">Woreda</span>
                      <span className="font-mono ml-auto">{woredaVal}</span>
                    </div>
                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">Kebele</span>
                      <span className="text-slate-400 ml-auto">-----</span>
                    </div>

                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">House No.</span>
                      <span className="font-mono ml-auto">{houseNoVal}</span>
                    </div>
                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">Tel.No</span>
                      <span className="font-mono ml-auto">{phoneVal}</span>
                    </div>

                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">Fax</span>
                      <span className="text-slate-400 ml-auto">-----</span>
                    </div>
                    <div className="flex items-baseline gap-1 border-b border-black pb-0.5">
                      <span className="text-slate-700">E-mail</span>
                      <span className="font-mono text-slate-800 ml-auto text-[9px] truncate max-w-[130px]">
                        {emailVal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. Field of Business */}
                <div>
                  <span className="font-bold block">6. Field of Business</span>
                  <div className="mt-0.5 text-[9.5px] leading-snug border-b border-black pb-0.5 font-medium">
                    {fieldOfBusiness.english}
                  </div>
                </div>

                {/* 7. Capital */}
                <div className="flex items-baseline justify-between border-b border-black pb-0.5">
                  <span className="font-bold">7. Capital in ETB</span>
                  <span className="font-mono font-bold text-[11px]">{formattedCapital}</span>
                </div>
              </div>
            </div>

            <hr className="my-1.5 border-t border-black" />

            {/* ---- ISSUANCE & SIGNATURES / OFFICIAL SEAL SECTION ---- */}
            <div className="relative grid grid-cols-2 gap-6 my-1 text-[10.5px] leading-tight">
              {/* Left Issuance & Signature */}
              <div>
                <p>
                  ይህ የንግድ ፈቃድ ዛሬ{' '}
                  <span className="underline font-bold font-mono">{ethDate.formatted}</span>{' '}
                  በ{' '}
                  <span className="underline font-bold">{regionAmharic}</span>{' '}
                  ተሰጠ ።
                </p>

                <div className="mt-2.5 flex items-center justify-between border-b border-black pb-0.5">
                  <span className="text-[10px] text-slate-800">የሃላፊ ስም/Name of Official</span>
                  <span className="font-bold text-[11px]">{officerNames.amharic}</span>
                </div>

                <div className="mt-1 flex items-center justify-between border-b border-black pb-0.5">
                  <span className="text-[10px] text-slate-800">ፊርማ/Signature</span>
                  <OfficialSignatureSvg />
                </div>
              </div>

              {/* Right Issuance & Official Stamp */}
              <div className="relative">
                <p>
                  This Business License is issued in{' '}
                  <span className="underline font-bold">{regionEnglish}</span>
                </p>
                <p className="mt-0.5">
                  this day{' '}
                  <span className="underline font-bold font-mono">{gregDate}</span>
                </p>

                <div className="mt-5 text-[10px] text-slate-500 flex justify-end">
                  <span>ማህተም / Seal</span>
                </div>

                {/* Official Blue Rubber Stamp Centered In This Area */}
                <BlueOfficialRubberStamp
                  size={130}
                  rotation={-8}
                  className="absolute -left-10 -top-3 z-10 opacity-90"
                />
              </div>
            </div>

            <hr className="my-1.5 border-t border-black" />
          </div>

          {/* ---- FOOTER: LEGAL NOTICES & QR CODE ---- */}
          <footer className="grid grid-cols-[1fr_auto] gap-4 items-center text-[8.5px] leading-tight text-black pt-0.5">
            <div className="space-y-0.5">
              <p>
                <span className="font-bold">ማሳሰቢያ-</span> 1. ይህ የንግድ ፍቃድ በዓዋጅ ፈቃድ ቁጥር 980/2008 መሠረት እንደ የበጀት ዓመቱ በአዋጅ በተቀመጠው መሰረት መታደስ አለበት።
              </p>
              <p className="text-slate-800">
                <span className="font-bold">N.B.</span> This License Shall be renewed in accordance with Proclamation No. 980/2008 as per the fiscal year.
              </p>
              <p className="pt-0.5">
                2. ይህ የንግድ ፈቃድ የምስክር ወረቀት በዋስትና ወይም በእዳ ሊያዝ አይችልም።
              </p>
              <p className="text-slate-800">
                The holder of this License is forbidden for surety ship or debt
              </p>
            </div>

            {/* Verification QR Code */}
            <div className="flex flex-col items-center">
              <QrBlock seed={application.verificationCode || application.referenceNumber} />
            </div>
          </footer>
        </div>
      </div>
    </Modal>
  );
};
