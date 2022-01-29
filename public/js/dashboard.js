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
            console.log(h)
            let owner = h.username
            const dad = $("<div>").addClass("")
            if(h.posts.length>0){
                h.posts.forEach(element => {
                    const a = $("<div>");a.addClass("card");
                    const b = $("<div>");b.addClass("card-header")
                    const c = $("<div>");c.addClass("d-flex justify-content-between")
                    const date = $("<div>").html(element.date)
                    const by = $("<span>").html(` by ${owner}`)
                    const d = $("<div>")
                    const link = $("<a />", {
                        name : "link",
                        href : `/singlePost/${element.id}`,
                        text : element.title
                    });
                    const desc = $("<div>").addClass("card-body")
                    const html = $("<h4>").addClass("card-text").html(element.description)
                    desc.append(html)
                    a.append(b.append(c.append(d.append(link, by),date)),desc)
                    const br = $("<br>")
                    dad.append(a,br)
                });
    
                $(".oldPosts").append(dad)

{/* <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <div><a href="/singlePost/{{post.id}}">{{post.title}} </a> by {{post.user.username}}</div> <div> {{post.date}}</div>
                </div>
            </div>
            <div class="card-body">
                <h4 class="card-text">{{post.description}}</h4>  
            </div>            
</div> */}



            }else{
                $(".oldPosts").append($("<h3>").text("No posts"))
            }
        
        })
    })

}


document.querySelector(".go").addEventListener("click",getId)

getId2()

