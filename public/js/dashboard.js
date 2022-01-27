
const postPost2 = async(id)=>{
    //e.preventDefault();
    //this is for posting a post
    let title = document.querySelector("#postTitle")
    let description = document.querySelector("#description")

    console.log(title.value)
    console.log(description.value)
    if(title.value.trim && description.value.trim){
        const resp = await fetch('/api/posts',{
            method:'post',
            body: JSON.stringify({
                
                title:title.value,
                description:description.value,
                creator_id:id
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        if(resp.ok){
            document.location.replace('/');
        }else{
            console.log("some erro")
        }
    }
}

const getId = async(e)=>{
    e.preventDefault();
    const res = await fetch('/api/users/session',{
        method:'get'
    })

    res.json().then(d=>{
        id = d.data.id
        postPost2(id);
    })
}

document.querySelector(".go").addEventListener("click",getId)
