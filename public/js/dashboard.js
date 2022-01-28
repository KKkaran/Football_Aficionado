let id;
//these 2 methods below are called when to create a new post
const postPost2 = async(id)=>{
    //e.preventDefault();
    //this is for posting a post
    let title = document.querySelector("#postTitle")
    let description = document.querySelector("#description")

    console.log(title.value)
    console.log(description.value)
    if(title.value.trim() && description.value.trim()){
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

//this is called when page refreshes to get the user id and get all his posts to display in the dashboard stuff.
const getId2 = async(e)=>{
    const res = await fetch('/api/users/session',{
        method:'get'
    })

    res.json().then(d=>d.data.id).then((f)=>{
        console.log("this is f:" + f)
        fetch(`/users/` + f,{
            method:'get'
        }).then(g=>g.json()).then(h=>{
            console.log(h.posts)

            const dad = $("<div>")
            if(h.posts.length>0){
                h.posts.forEach(element => {
                    dad.append($('<h3>').text(element.title))
                });
    
                $(".oldPosts").append(dad)
            }else{
                $(".oldPosts").append($("<h3>").text("No posts"))
            }
            

        })
    })

}


document.querySelector(".go").addEventListener("click",getId)

getId2()

