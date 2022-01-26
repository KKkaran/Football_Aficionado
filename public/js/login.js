const loginUser = async(e)=>{
    e.preventDefault();
    //try to fetch the data with the info user provided and
    //see if it was correct and then we log him in
    let email = document.querySelector("#exampleInputEmail1").value;
    let password = document.querySelector("#exampleInputPassword1").value
    console.log(email)
    const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
    if (response.ok) {
        document.location.replace('/');
    } else {
        alert(response.statusText);
    }

    console.log('tryin to login the user')
}



document.querySelector(".form-login").addEventListener('submit', loginUser)