//fetch info from db sessions table and see if someone is loggedIn or not
let loginText = document.querySelector('.signin');

const getValueFromSessionsDb = async()=>{

    const res = await fetch('/api/users/session',{
        method:'get'
    })

    if(res.status == 200){
        loginText.text = "Logout"
    }else{
        loginText.text = "Login"

    }
}

getValueFromSessionsDb();