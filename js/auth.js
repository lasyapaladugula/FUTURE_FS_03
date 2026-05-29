// Simple client-side auth for demo using localStorage
document.addEventListener('DOMContentLoaded',()=>{
  const signupForm=document.getElementById('signupForm');
  const loginForm=document.getElementById('loginForm');
  const logoutLink=document.getElementById('logoutLink');

  if(signupForm){
    signupForm.addEventListener('submit',async e=>{
      e.preventDefault();
      const form=new FormData(signupForm);
      const name=form.get('name').trim();
      const email=form.get('email').trim().toLowerCase();
      const password=form.get('password');
      if(!email||!password){ alert('Please fill in all fields'); return; }
      // Try backend signup first
      try{
        const res=await fetch('http://localhost:4000/api/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password})});
        if(res.ok){ const data=await res.json(); localStorage.setItem('si_auth', JSON.stringify({email:data.user.email,name:data.user.name})); window.location.href='dashboard.html'; return; }
        const err=await res.json(); alert(err.error||'Signup failed');
      }catch(err){
        // fallback to localStorage demo
        const users=JSON.parse(localStorage.getItem('si_users')||'[]');
        if(users.find(u=>u.email===email)){ alert('Account already exists with this email'); return; }
        users.push({name,email,password});
        localStorage.setItem('si_users',JSON.stringify(users));
        localStorage.setItem('si_auth', JSON.stringify({email,name}));
        window.location.href='dashboard.html';
      }
    });
  }

  if(loginForm){
    loginForm.addEventListener('submit',async e=>{
      e.preventDefault();
      const form=new FormData(loginForm);
      const email=form.get('email').trim().toLowerCase();
      const password=form.get('password');
      try{
        const res=await fetch('http://localhost:4000/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
        if(res.ok){ const data=await res.json(); localStorage.setItem('si_auth', JSON.stringify({email:data.user.email,name:data.user.name})); window.location.href='dashboard.html'; return; }
        const err=await res.json(); alert(err.error||'Login failed');
      }catch(err){
        const users=JSON.parse(localStorage.getItem('si_users')||'[]');
        const user=users.find(u=>u.email===email && u.password===password);
        if(!user){ alert('Invalid credentials'); return; }
        localStorage.setItem('si_auth', JSON.stringify({email:user.email,name:user.name}));
        window.location.href='dashboard.html';
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

  // On dashboard page, show user info or redirect to login
  const userNameSpan=document.getElementById('userName');
  if(userNameSpan){
    const auth=JSON.parse(localStorage.getItem('si_auth')||'null');
    if(!auth){ window.location.href='login.html'; }
    else {
      userNameSpan.textContent=auth.name||auth.email;
      const dash=document.getElementById('dashboardContent');
      if(dash) dash.innerHTML=`<p><strong>Email:</strong> ${auth.email}</p><p><em>This is a demo dashboard (no backend).</em></p>`;
      const out=document.getElementById('logoutLink'); if(out) out.style.display='inline-block';
    }
  }
});
