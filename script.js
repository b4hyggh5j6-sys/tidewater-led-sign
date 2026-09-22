const dialog=document.querySelector('#quote-dialog');
const form=document.querySelector('#quote-form');
const steps=[...document.querySelectorAll('.form-step')];
const progress=[...document.querySelectorAll('.quote-progress i')];
const result=document.querySelector('.quote-result');
const menu=document.querySelector('.menu');
const nav=document.querySelector('.header nav');
const productGallery=document.querySelector('#product-gallery');
const productGalleryGrid=document.querySelector('#product-gallery-grid');
let current=0;
let selectedQuoteFiles=[];
let activeGallery='';

const galleryData={
  channel:{title:'Storefront & Channel Letters',copy:'Explore front-lit, halo-lit, and dimensional storefront lettering for strong day-and-night visibility.',type:'Channel letters',items:[['assets/01-channel-letters-coffee-shop.png','Storefront Channel Letters'],['assets/02-channel-letters-bobycare.png','Halo-Lit Logo & Letters'],['assets/storefront.jpeg','Full Façade Lettering'],['assets/fabrication.jpeg','Letters During Fabrication']]},
  lightbox:{title:'Hanging & Cabinet Light Boxes',copy:'See wall-mounted, hanging, roadside, single-sided, and double-sided illuminated cabinet options.',type:'Cabinet / light box',items:[['assets/05-hanging-lightbox-blue.jpg','Hanging Light Box'],['assets/06-wall-lightbox-4-of-ten.jpg','Wall-Mounted Light Box'],['assets/roadside-front.jpeg','Roadside Cabinet — Front'],['assets/roadside-back.jpeg','Double-Sided Cabinet']]},
  rgb:{title:'RGB & Color-Changing Letters',copy:'Programmable color, gradient effects, and specialty lighting for brands that want maximum nighttime impact.',type:'RGB / specialty',items:[['assets/04-rgb-color-changing-feuer-alarm.jpg','RGB Dimensional Letters'],['assets/09-infinity-mirror-smile.jpg','Multi-Color Specialty Sign'],['assets/08-circular-neon-hair-salon.jpg','Circular Color Lighting'],['assets/07-led-neon-hello-gorgeous.png','Custom Color Display']]},
  halo:{title:'Halo-Lit Letters',copy:'Premium dimensional letters with soft rear illumination, clean edges, and architectural depth.',type:'Channel letters',items:[['assets/02-channel-letters-bobycare.png','Halo-Lit Storefront Letters'],['assets/03-backlit-letters-food-susy.jpg','Backlit Vertical Letters'],['assets/01-channel-letters-coffee-shop.png','Warm White Halo Letters'],['assets/storefront.jpeg','Commercial Façade Letters']]},
  backlit:{title:'Backlit Characters & Logos',copy:'Dimensional characters and custom logos designed to create a refined glow behind each element.',type:'Channel letters',items:[['assets/03-backlit-letters-food-susy.jpg','Architectural Backlit Letters'],['assets/02-channel-letters-bobycare.png','Backlit Logo & Wordmark'],['assets/01-channel-letters-coffee-shop.png','Backlit Storefront Letters'],['assets/fabrication.jpeg','Illuminated Components']]},
  neon:{title:'Custom LED Neon',copy:'Flexible custom shapes, lettering, circular signs, logos, and interior statement pieces.',type:'LED neon',items:[['assets/07-led-neon-hello-gorgeous.png','Custom Script Neon'],['assets/08-circular-neon-hair-salon.jpg','Circular Business Neon'],['assets/09-infinity-mirror-smile.jpg','Specialty Neon Display'],['assets/04-rgb-color-changing-feuer-alarm.jpg','Color-Changing Lettering']]},
  infinity:{title:'Infinity Mirror & Specialty Signs',copy:'Layered illumination and mirror-depth effects for futuristic logos, feature walls, and showpiece signs.',type:'RGB / specialty',items:[['assets/09-infinity-mirror-smile.jpg','Infinity Mirror Sign'],['assets/04-rgb-color-changing-feuer-alarm.jpg','RGB Specialty Letters'],['assets/08-circular-neon-hair-salon.jpg','Circular Light Feature'],['assets/07-led-neon-hello-gorgeous.png','Custom Interior Feature']]}
};

function showStep(index){
  current=index;
  steps.forEach((step,i)=>step.classList.toggle('active',i===index));
  progress.forEach((item,i)=>item.classList.toggle('active',i<=index));
  dialog.scrollTo({top:0,behavior:'smooth'});
}
function validateStep(){
  const fields=[...steps[current].querySelectorAll('input,textarea,select')];
  return fields.every(field=>field.reportValidity());
}
function openQuote(){
  dialog.showModal();document.body.style.overflow='hidden';form.reset();
  document.querySelectorAll('.file-preview').forEach(box=>box.innerHTML='');
  document.querySelector('#quote-title').textContent='Tell us about your sign.';
  showStep(0);form.hidden=false;result.hidden=true;
}
function closeQuote(){dialog.close();document.body.style.overflow='';}

document.querySelectorAll('[data-quote]').forEach(button=>button.addEventListener('click',openQuote));
document.querySelectorAll('[data-industry]').forEach(button=>button.addEventListener('click',()=>{
  openQuote();form.elements.industry.value=button.dataset.industry;
  document.querySelector('#quote-title').textContent=`Tell us about your ${button.dataset.industry} sign.`;
}));
document.querySelector('.dialog-close').addEventListener('click',closeQuote);
dialog.addEventListener('click',event=>{if(event.target===dialog)closeQuote();});
dialog.addEventListener('close',()=>document.body.style.overflow='');
document.querySelectorAll('.next').forEach(button=>button.addEventListener('click',()=>{if(validateStep())showStep(Math.min(current+1,steps.length-1));}));
document.querySelectorAll('.back').forEach(button=>button.addEventListener('click',()=>showStep(Math.max(current-1,0))));
document.querySelector('.edit-request').addEventListener('click',()=>{result.hidden=true;form.hidden=false;showStep(3);});

document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{
  activeGallery=button.dataset.gallery;const data=galleryData[activeGallery];
  document.querySelector('#product-gallery-title').textContent=data.title;
  document.querySelector('#product-gallery-copy').textContent=data.copy;
  productGalleryGrid.innerHTML=data.items.map(([src,label])=>`<figure><img src="${src}" alt="${label}" loading="lazy"><figcaption>${label}</figcaption></figure>`).join('');
  productGallery.showModal();document.body.style.overflow='hidden';
}));
document.querySelector('.gallery-close').addEventListener('click',()=>productGallery.close());
productGallery.addEventListener('click',event=>{if(event.target===productGallery)productGallery.close();});
productGallery.addEventListener('close',()=>{if(!dialog.open)document.body.style.overflow='';});
document.querySelector('#gallery-start-project').addEventListener('click',()=>{
  const data=galleryData[activeGallery];productGallery.close();openQuote();
  const choice=Array.from(form.elements.type).find(input=>input.value===data.type);if(choice)choice.checked=true;
  form.elements.industry.value=data.title;
});

document.querySelectorAll('input[type="file"][data-preview]').forEach(input=>input.addEventListener('change',()=>{
  const box=document.getElementById(input.dataset.preview);box.innerHTML='';
  [...input.files].slice(0,8).forEach(file=>{
    const chip=document.createElement('span');chip.className='file-chip';
    if(file.type.startsWith('image/')){const image=document.createElement('img');image.src=URL.createObjectURL(file);image.alt='';chip.appendChild(image);}
    const name=document.createElement('span');name.textContent=file.name;chip.appendChild(name);box.appendChild(chip);
  });
}));

menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelectorAll('details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('details').forEach(other=>{if(other!==item)other.open=false;});}));

form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const data=new FormData(form);
  const storefront=[...form.elements.storefrontFiles.files].map(file=>file.name);
  const logos=[...form.elements.logoFiles.files].map(file=>file.name);
  selectedQuoteFiles=[...form.elements.storefrontFiles.files,...form.elements.logoFiles.files];
  const request=`TIDEWATER LED SIGNS — QUOTE REQUEST\n\nCONTACT\nName / Company: ${data.get('contact')}\nPhone: ${data.get('phone')}\nEmail: ${data.get('email')}\nProject Location: ${data.get('location')}\nText permission: ${data.get('textOkay')||'No'}\n\nPROJECT\nBusiness / Gallery Interest: ${data.get('industry')||'Not specified'}\nSign Type: ${data.get('type')}\nApproximate Size: ${data.get('size')||'Not provided'}\nInstallation: ${data.get('installation')}\nTarget Timeline: ${data.get('timeline')}\nEstimated Budget: ${data.get('budget')}\n\nJOB DESCRIPTION\n${data.get('details')}\n\nSITE CONDITIONS\n${data.get('conditions')||'Not provided'}\n\nFILES SELECTED\nStorefront / location: ${storefront.join(', ')||'None selected'}\nLogo / inspiration: ${logos.join(', ')||'None selected'}\n\nPlease attach the selected photos and artwork to this message.`;
  document.querySelector('#quote-output').value=request;
  document.querySelector('#text-request').href=`sms:+17578954537?&body=${encodeURIComponent(request)}`;
  form.hidden=true;result.hidden=false;dialog.scrollTo({top:0,behavior:'smooth'});
});

document.querySelector('#share-request').addEventListener('click',async()=>{
  const text=document.querySelector('#quote-output').value;
  try{
    const payload={title:'Tidewater LED Signs Quote Request',text};
    if(selectedQuoteFiles.length&&navigator.canShare?.({files:selectedQuoteFiles}))payload.files=selectedQuoteFiles;
    if(navigator.share){await navigator.share(payload);return;}
  }catch(error){if(error.name==='AbortError')return;}
  window.location.href=document.querySelector('#text-request').href;
});

document.querySelector('#copy-request').addEventListener('click',async()=>{
  await navigator.clipboard.writeText(document.querySelector('#quote-output').value);
  const toast=document.querySelector('.toast');toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400);
});
showStep(0);
