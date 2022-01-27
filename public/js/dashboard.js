const postPost2 = async(e)=>{
    e.preventDefault();

    //this is for posting a post
    let title = document.querySelector("#postTitle")
    let description = document.querySelector("#description")

    console.log(title.value)
    console.log(description.value)

    const resp = await fetch('/api/posts',{
        method:'post',
        body: JSON.stringify({
            title:title.value,
            description:description.value
        }),
        headers: { 'Content-Type': 'application/json' }
    })

    if(resp.ok){

    }else{

    }



}





console.log("in dashboard")






document.querySelector(".go").addEventListener("click",postPost2)