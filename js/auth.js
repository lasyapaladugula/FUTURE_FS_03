// Simple client-side auth for demo using localStorage
document.addEventListener('DOMContentLoaded',()=>{
  const signupForm=document.getElementById('signupForm');
  const loginForm=document.getElementById('loginForm');
  const logoutLink=document.getElementById('logoutLink');

  function showFormMessage(form,text,type){
    if(!form) return;
    let msg=form.querySelector('.form-message');
    if(!msg){
      msg=document.createElement('div');
      msg.className='form-message';
      form.prepend(msg);
    }
    msg.textContent=text;
    msg.className=`form-message ${type==='success' ? 'form-success' : 'form-error'}`;
  }

  function clearFormMessage(form){
    const msg=form?.querySelector('.form-message');
    if(msg) msg.remove();
  }

  if(signupForm){
    signupForm.addEventListener('submit',async e=>{
      e.preventDefault();
      clearFormMessage(signupForm);
      const form=new FormData(signupForm);
      const name=form.get('name').trim();
      const email=form.get('email').trim().toLowerCase();
      const password=form.get('password');
      if(!name||!email||!password){ showFormMessage(signupForm,'Please complete all fields before continuing.','error'); return; }
      const btn=signupForm.querySelector('button[type="submit"]');
      if(btn){ btn.disabled=true; btn.textContent='Creating account...'; }
      try{
        const res=await fetch('http://localhost:4000/api/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password})});
        if(res.ok){
          const data=await res.json();
          localStorage.setItem('si_auth',JSON.stringify({email:data.user.email,name:data.user.name}));
          window.location.href='dashboard.html';
          return;
        }
        const err=await res.json();
        showFormMessage(signupForm,err.error||'Signup failed. Please try again.','error');
      }catch(err){
        const users=JSON.parse(localStorage.getItem('si_users')||'[]');
        if(users.find(u=>u.email===email)){ showFormMessage(signupForm,'An account already exists with this email.','error'); return; }
        users.push({name,email,password});
        localStorage.setItem('si_users',JSON.stringify(users));
        localStorage.setItem('si_auth',JSON.stringify({email,name}));
        window.location.href='dashboard.html';
      } finally {
        if(btn){ btn.disabled=false; btn.textContent='Create account'; }
      }
    });
  }

  if(loginForm){
    loginForm.addEventListener('submit',async e=>{
      e.preventDefault();
      clearFormMessage(loginForm);
      const form=new FormData(loginForm);
      const email=form.get('email').trim().toLowerCase();
      const password=form.get('password');
      if(!email||!password){ showFormMessage(loginForm,'Please enter your email and password.','error'); return; }
      const btn=loginForm.querySelector('button[type="submit"]');
      if(btn){ btn.disabled=true; btn.textContent='Logging in...'; }
      try{
        const res=await fetch('http://localhost:4000/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
        if(res.ok){
          const data=await res.json();
          localStorage.setItem('si_auth',JSON.stringify({email:data.user.email,name:data.user.name}));
          window.location.href='dashboard.html';
          return;
        }
        const err=await res.json();
        showFormMessage(loginForm,err.error||'Login failed. Please check your credentials.','error');
      }catch(err){
        const users=JSON.parse(localStorage.getItem('si_users')||'[]');
        const user=users.find(u=>u.email===email && u.password===password);
        if(!user){ showFormMessage(loginForm,'Invalid email or password.','error'); return; }
        localStorage.setItem('si_auth',JSON.stringify({email:user.email,name:user.name}));
        window.location.href='dashboard.html';
      } finally {
        if(btn){ btn.disabled=false; btn.textContent='Login'; }
      }
    });
  }

  if(logoutLink){
    logoutLink.addEventListener('click',e=>{
      e.preventDefault();
      localStorage.removeItem('si_auth');
      window.location.href='index.html';
    });
  }

  const userNameSpan=document.getElementById('userName');
  if(userNameSpan){
    const auth=JSON.parse(localStorage.getItem('si_auth')||'null');
    if(!auth){ window.location.href='login.html'; return; }
    userNameSpan.textContent=auth.name||auth.email;
    const dash=document.getElementById('dashboardContent');
    if(dash){
      const leads=[
        {name:'Mia Patel',email:'mia.patel@example.com',source:'Website',status:'New',note:'Interested in weekend table for 4.'},
        {name:'Rahul Mehta',email:'rahul.mehta@example.com',source:'Contact form',status:'Contacted',note:'Wants catering for office event.'},
        {name:'Ananya Roy',email:'ananya.roy@example.com',source:'Instagram',status:'Converted',note:'Booked a coffee tasting session.'}
      ];
      const leadCards=leads.map(lead=>`
        <div class="lead-item">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:.75rem;flex-wrap:wrap">
            <h4>${lead.name}</h4>
            <span class="status ${lead.status.toLowerCase()}">${lead.status}</span>
          </div>
          <p><strong>Email:</strong> ${lead.email}</p>
          <p><strong>Source:</strong> ${lead.source}</p>
          <p>${lead.note}</p>
        </div>
      `).join('');
      dash.innerHTML=`
        <div class="dashboard-overview">
          <div class="card card-body">
            <h4>Profile</h4>
            <p><strong>Name:</strong> ${auth.name}</p>
            <p><strong>Email:</strong> ${auth.email}</p>
          </div>
          <div class="card card-body">
            <h4>Lead summary</h4>
            <p><strong>${leads.length}</strong> total leads</p>
            <p><strong>2</strong> engaged, <strong>1</strong> converted.</p>
          </div>
        </div>
        <section class="lead-list">
          ${leadCards}
        </section>
      `;
    }
    const out=document.getElementById('logoutLink'); if(out) out.style.display='inline-block';
  }
});
