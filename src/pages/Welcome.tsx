import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle2, Camera, BarChart3, BookOpen, AlertTriangle } from 'lucide-react';
import { Logo } from '../components/shared/Logo';
import { Button } from '../components/ui';

const BENEFITS = [
  {
    icon: Camera,
    title: 'Detect possible issues earlier',
    desc: 'Upload a leaf image and review visible symptoms within a minute.',
  },
  {
    icon: BarChart3,
    title: 'Understand visible symptoms',
    desc: 'Get a plain-language explanation of what the image shows and what it may mean.',
  },
  {
    icon: BookOpen,
    title: 'Keep field observations organised',
    desc: 'Save analyses to fields and build a complete crop-health record over time.',
  },
];

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#F7F8F3] flex flex-col">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #174A35, transparent)' }}
        />
        <div
          className="absolute bottom-0 -left-20 w-64 h-64 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #6F8F55, transparent)' }}
        />
      </div>

      <div className="relative flex-1 flex flex-col lg:flex-row">
        {/* Left / Main content */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-xl mx-auto w-full lg:mx-0 lg:pl-16 lg:pr-12">
          {/* Logo */}
          <div className="mb-10">
            <Logo size={40} showText />
          </div>

          {/* Hero */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#DDEBDF] rounded-full mb-5">
              <Shield className="h-3.5 w-3.5 text-[#174A35]" />
              <span className="text-xs font-semibold text-[#174A35] tracking-wide uppercase">Crop Health Intelligence</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1E2923] leading-tight mb-4">
              A clearer view of<br />your crop health.
            </h1>
            <p className="text-[#66736A] text-base leading-relaxed max-w-md">
              Check leaf images, understand possible risks, and keep every field observation in one place.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/analyze')}
              className="sm:flex-1"
            >
              Analyze a crop
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => navigate('/analyze?sample=true')}
              className="sm:flex-1"
            >
              Try a sample analysis
            </Button>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-10">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-[10px] bg-[#DDEBDF] flex items-center justify-center shrink-0 mt-0.5">
                  <b.icon className="h-4 w-4 text-[#174A35]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1E2923]">{b.title}</p>
                  <p className="text-xs text-[#66736A] mt-0.5 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Demo / Continue */}
          <div className="border-t border-[#DDE3DB] pt-6">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => navigate('/home')}
              icon={<CheckCircle2 className="h-4 w-4" />}
            >
              Continue with demo account
            </Button>
            <p className="text-xs text-center text-[#66736A] mt-2.5">
              No sign-up required. All data is saved locally on your device.
            </p>
          </div>

          {/* Trust note */}
          <div className="mt-6 flex gap-2.5 p-3.5 bg-[#FEF3C7] rounded-[10px] border border-[#f6d860]/40">
            <AlertTriangle className="h-4 w-4 text-[#B7791F] shrink-0 mt-0.5" />
            <p className="text-xs text-[#B7791F] leading-relaxed">
              CropGuard supports agricultural decisions. Always verify results with a local agricultural expert before applying any treatment.
            </p>
          </div>
        </div>

        {/* Right / Visual panel (desktop only) */}
        <div className="hidden lg:flex lg:w-[420px] xl:w-[500px] bg-[#174A35] relative overflow-hidden flex-col justify-between p-10">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute border border-white rounded-full"
                style={{
                  width: `${(i + 1) * 100}px`,
                  height: `${(i + 1) * 100}px`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: 0.4 - i * 0.05,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="text-white/60 text-xs font-medium uppercase tracking-widest mb-2">For farmers & field officers</div>
            <h2 className="text-white text-2xl font-bold leading-snug">
              Protect every crop<br />with earlier, clearer<br />decisions.
            </h2>
          </div>

          {/* Mock result card */}
          <div className="relative z-10 bg-white rounded-[16px] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-[8px] bg-[#FDECEA] flex items-center justify-center">
                <span className="text-base">🍅</span>
              </div>
              <div>
                <p className="text-xs text-[#66736A]">Tomato · North Tomato Field</p>
                <p className="text-sm font-semibold text-[#1E2923]">Possible Early Blight</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs bg-[#FEF3C7] text-[#B7791F] px-2 py-0.5 rounded-full font-semibold">Moderate</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#66736A]">Confidence</span>
              <span className="text-xs font-semibold text-[#1E2923]">91%</span>
            </div>
            <div className="h-1.5 bg-[#EEF1E9] rounded-full overflow-hidden">
              <div className="h-full bg-[#2F7D4A] rounded-full" style={{ width: '91%' }} />
            </div>
            <p className="mt-3 text-xs text-[#66736A] italic">
              AI-assisted result. Verify with a local agricultural expert before applying treatment.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex gap-2 flex-wrap">
              {['Tomato', 'Potato', 'Rice', 'Wheat', 'Maize'].map(crop => (
                <span key={crop} className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                  {crop}
                </span>
              ))}
            </div>
            <p className="text-white/40 text-xs mt-3">
              Prototype model · Demo inference · Not for medical or commercial use
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
