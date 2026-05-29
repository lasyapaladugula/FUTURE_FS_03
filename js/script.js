// Small helper: set year and handle form submission UI
document.addEventListener('DOMContentLoaded',()=>{
  const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
  const form=document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit',async (e)=>{
      e.preventDefault();
      const btn=form.querySelector('button[type="submit"]');
      if(btn){btn.disabled=true;btn.textContent='Sending...'}
      const formAction=form.getAttribute('action') || '';
      const data=new FormData(form);
      try{
        if(formAction.includes('formspree.io')){
          // actually submit to Formspree
          const res=await fetch(formAction, {method:'POST',body:data,headers:{'Accept':'application/json'}});
          if(res.ok){ showSuccess(); form.reset(); }
          else { showError(); }
        } else {
          // simulate success for local testing
          await new Promise(r=>setTimeout(r,600));
          showSuccess(); form.reset();
        }
      }catch(err){ showError(); }
      if(btn){btn.disabled=false;btn.textContent='Send Message'}
    });
  }
  function showSuccess(){
    const msg=document.createElement('div');
    msg.className='form-success';
    msg.textContent='Thanks — we received your message and will respond shortly.';
    form.prepend(msg);
    setTimeout(()=>{msg.remove()},5000);
  }
  function showError(){
    const msg=document.createElement('div');
    msg.className='form-error';
    msg.textContent='Sorry, something went wrong. Please try again later.';
    form.prepend(msg);
    setTimeout(()=>{msg.remove()},5000);
  }
});

