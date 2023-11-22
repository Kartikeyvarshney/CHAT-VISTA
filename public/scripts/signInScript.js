const logo = document.querySelector('.logo')
const form = document.querySelector('form')
const email_error = document.querySelector('.email_error')
const password_error = document.querySelector('.password_error')
const eyeIcon = document.querySelector('.eyeIcon')
const userPassword = document.querySelector('#userpassword')
const lockIcion = document.querySelector('.lockIcon')
eyeIcon.addEventListener('click',()=>{
   if(eyeIcon.classList.contains('fa-eye'))
   {
    eyeIcon.classList.remove('fa-eye')
    eyeIcon.classList.add('fa-eye-slash')
    userPassword.type='text'
    lockIcion.classList.remove('fa-lock')
    lockIcion.classList.add('fa-unlock')
   }
   else
   {
    eyeIcon.classList.remove('fa-eye-slash')
    eyeIcon.classList.add('fa-eye')
    userPassword.type='password'
    lockIcion.classList.remove('fa-unlock')
    lockIcion.classList.add('fa-lock')
   }
   })
logo.addEventListener('click', () => {
    location.assign('/')
})
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    email_error.textContent = ''
    password_error.textContent = ''


    const userEmail = form.userEmail.value;
    const userPassword = form.userPassword.value;

    try {
        const res = await fetch('/signin', { method: "POST", body: JSON.stringify({ userEmail: userEmail, userPassword: userPassword }), headers: { 'Content-Type': 'application/json' } })
        const data = await res.json()
        if (data.errors) {
            email_error.textContent = data.errors.userEmail
            password_error.textContent = data.errors.userPassword
        }
        if (data.user) {
            location.assign('/')
        }
    }
    catch (error) {
        console.log(error)
    }
})