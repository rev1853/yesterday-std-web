import imgTexturepng1 from "figma:asset/068ba750536024b71703cd2db412b4e7f82fa419.png";
import imgAltUrpicturaLogo1 from "figma:asset/3685819804143063dcdb082bf0e6c829b71e73b3.png";
import imgEllipse1 from "figma:asset/3662aadcb164064867a9127d032356609936dc85.png";
import imgFrame55 from "figma:asset/dc9710d1f3c1ac5c8407b0aaeeb1fac95c62983d.png";
import imgRectangle9 from "figma:asset/18ce9dbfa4fb788e49c70af0d4ef8d674722c010.png";
import imgRectangle11 from "figma:asset/dfa4442751c61ba05a11953246f5468129db27d9.png";
import imgRectangle15 from "figma:asset/08541623f646225af025bcb096f9e1a5ced1fe98.png";
import imgRectangle12 from "figma:asset/efc832ebfe64eb640f5c019fa0ba45cbc252349d.png";
import imgRectangle16 from "figma:asset/4edffbe8aaf224011bf6cf2edd5dcf1b302a5e13.png";
import imgRectangle10 from "figma:asset/3237b9e70fe735e536cad8b0a5d9995a6f6aa1f6.png";
import imgRectangle14 from "figma:asset/8ebf14d458196f6acfdcfdd1afa9adc590fb20e8.png";
import imgRectangle13 from "figma:asset/1eae168afbdb3225745cf7b205b41ea38f7b554d.png";

function Texture() {
  return (
    <div className="absolute content-stretch flex gap-[100px] items-center left-[48px] top-[109px]" data-name="texture">
      <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "690", "--transform-inner-height": "660" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-[660px] relative w-[690px]" data-name="texturepng 1">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover opacity-[0.02] pointer-events-none size-full" src={imgTexturepng1} />
          </div>
        </div>
      </div>
      <div className="h-[629px] relative shrink-0 w-[658px]" data-name="texturepng 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover opacity-[0.02] pointer-events-none size-full" src={imgTexturepng1} />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[40px] items-center relative shrink-0">
      <div className="h-[68px] relative shrink-0 w-[61px]" data-name="ALT_URPICTURA_LOGO 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgAltUrpicturaLogo1} />
      </div>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[124.66%] not-italic relative shrink-0 text-[14px] text-center text-neutral-100 text-nowrap tracking-[-0.7px] whitespace-pre">Home</p>
      <p className="font-['Inter:Black',sans-serif] font-black leading-[124.66%] not-italic relative shrink-0 text-[14px] text-center text-neutral-100 text-nowrap tracking-[-0.7px] whitespace-pre">Dashboard</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[124.66%] not-italic relative shrink-0 text-[20px] text-center text-neutral-100 text-nowrap tracking-[-1px] whitespace-pre">Creators</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[124.66%] not-italic relative shrink-0 text-[14px] text-center text-neutral-100 text-nowrap tracking-[-0.7px] whitespace-pre">Contact Us</p>
    </div>
  );
}

function Navbar() {
  return (
    <div className="absolute content-stretch flex gap-[660px] items-end left-[138px] top-[41px] w-[1162px]" data-name="navbar">
      <Frame1 />
      <div className="relative shrink-0 size-[65px]">
        <img alt="" className="block max-w-none size-full" height="65" src={imgEllipse1} width="65" />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[720px] left-0 shadow-[2px_9px_13.1px_0px_rgba(0,0,0,0.08)] top-[172px] w-[1440px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgFrame55} />
        <div className="absolute bg-[rgba(0,0,0,0.5)] inset-0" />
      </div>
      <div className="[text-shadow:rgba(0,0,0,0.1)_0px_8px_20px] absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-[141px] left-[720px] not-italic text-[128px] text-center text-neutral-100 top-[219px] tracking-[-6.4px] translate-x-[-50%] w-[846px]">
        <p className="mb-0">Wedding Day</p>
        <p>{`Arthur & Sadie`}</p>
      </div>
      <p className="[text-shadow:rgba(0,0,0,0.1)_0px_8px_20px] absolute font-['Inter:Regular',sans-serif] font-normal leading-[1.08] left-[720px] not-italic text-[20px] text-center text-neutral-100 text-nowrap top-[537px] tracking-[-1px] translate-x-[-50%] whitespace-pre">29 October 2025</p>
    </div>
  );
}

export default function Desktop() {
  return (
    <div className="bg-[#0d0d0d] relative size-full" data-name="Desktop - 6">
      <div className="absolute h-[6854px] left-0 top-0 w-[1440px]" />
      <Texture />
      <Navbar />
      <Frame />
      <div className="absolute h-[674.826px] left-[137px] rounded-[15px] top-[1048px] w-[447.478px]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
          <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle9} />
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[calc(41.67%+24.17px)] top-[1048px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "447.46875", "--transform-inner-height": "674.8125" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-[674.826px] relative rounded-[15px] w-[447.478px]">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
              <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
              <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle11} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[calc(41.67%+25px)] top-[2051px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "447.46875", "--transform-inner-height": "674.8125" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-[674.826px] relative rounded-[15px] w-[447.478px]">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
              <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
              <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle15} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[calc(41.67%+24.17px)] top-[1549.61px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "447.46875", "--transform-inner-height": "674.8125" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-[674.826px] relative rounded-[15px] w-[447.478px]">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
              <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
              <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle12} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[137px] top-[2558px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "447.46875", "--transform-inner-height": "674.8125" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-[674.826px] relative rounded-[15px] w-[447.478px]">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
              <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
              <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle16} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[674.826px] left-[137px] rounded-[15px] top-[1773.35px] w-[447.478px]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
          <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle10} />
        </div>
      </div>
      <div className="absolute h-[674.826px] left-[calc(58.33%+12px)] rounded-[15px] top-[2553px] w-[447.478px]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
          <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle14} />
        </div>
      </div>
      <div className="absolute h-[674.826px] left-[calc(58.33%+11px)] rounded-[15px] top-[3280px] w-[447.478px]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
          <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle9} />
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[calc(41.67%+23px)] top-[4052px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "447.46875", "--transform-inner-height": "674.8125" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-[674.826px] relative rounded-[15px] w-[447.478px]">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
              <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
              <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle15} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[137px] top-[3554px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "447.46875", "--transform-inner-height": "674.8125" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-[674.826px] relative rounded-[15px] w-[447.478px]">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
              <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
              <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle12} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[calc(41.67%+23px)] top-[4550px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "447.46875", "--transform-inner-height": "674.8125" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-[674.826px] relative rounded-[15px] w-[447.478px]">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
              <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
              <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle16} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[674.826px] left-[137px] rounded-[15px] top-[4052px] w-[447.478px]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
          <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle10} />
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[137px] top-[3056px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "447.46875", "--transform-inner-height": "674.8125" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-[674.826px] relative rounded-[15px] w-[447.478px]">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
              <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
              <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle11} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[calc(41.67%+25px)] top-[5048px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "447.46875", "--transform-inner-height": "674.8125" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-[674.826px] relative rounded-[15px] w-[447.478px]">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
              <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
              <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle11} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[674.826px] left-[137px] rounded-[15px] top-[4790px] w-[447.478px]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[15px]">
          <div className="absolute bg-[#d9d9d9] inset-0 rounded-[15px]" />
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[15px] size-full" src={imgRectangle13} />
        </div>
      </div>
    </div>
  );
}