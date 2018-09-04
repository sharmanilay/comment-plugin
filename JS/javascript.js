
var data = {
  Comments: [],
  user: []
}
var currentUser;
var userId = 0;
/*
Comment = {
  id: integer,
  User: User,
  time: time,
  text: String,
  replies: [],
  votes: Integer
}
User = {
  userId: Integer,
  Name: name,
  Avatar: Image
}
*/
class Comment {
  constructor(root) {
      //state varialbles
      this.state = []

      //UI varialbles
      this.root  = root;
      this.form = root.querySelector('form');
      this.input = this.form.querySelector('input');
      this.help = root.querySelector('.help');
      this.ul = root.querySelector('ul');
      this.items = {}


      // event handlers
      this.form.addEventListener('submit', e=>{
          e.preventDefault()
          const comment = this.input.value
          this.input.value = ''
          if(comment!=""){
            this.addComment(comment);
          }
      })
      this.ul.addEventListener('click', e=> {
        e.preventDefault();
        const id = e.target.getAttribute('data-delete-id')
        if(!id) return // user clicked in something else
        this.removeComment(id)
      })
    }
      addComment(comment){
        // state logic
        const id = String(Date.now())
        this.state = this.state.concat({comment, id})
        data.Comments = data.Comments.concat({
          comment: comment,
          id: id,
          time: id,
          user: currentUser,
          votes: 0
        })

        // UI logic
        this.updateHelp()


        const li = document.createElement('li')
        const span1 = document.createElement('span');
        const span = document.createElement('span')
        const del = document.createElement('a')
        span1.innerText = currentUser
        span1.classList.add('title')
        span1.classList.add('username')
        span.classList.add('comment')
        span.innerText = comment
        del.innerText = 'delete'
        del.setAttribute('data-delete-id',id)
        li.classList.add('collection-item');

        this.ul.appendChild(li)
        li.appendChild(span1)
        li.appendChild(document.createElement('br'))
        li.appendChild(del)
        li.appendChild(span)
        this.items[id] = li
      }
      removeComment(id) {
        // state logic
        const li = this.items[id]
        this.state = this.state.filter(item => item.id!==id)

        //  UI logic
        this.updateHelp()

        this.ul.removeChild(li)
      }
      //utility method
      updateHelp(){
        if(this.state.length >0){
          this.help.classList.add('hidden')
        }else {
          this.help.classList.remove('hidden')
        }
      }
}

class User {
  constructor(doc,userId) {
    this.doc = doc;
    this.formName = doc.querySelector('form');
    this.nameInput = this.formName.querySelector('input');
    const name = this.nameInput.value;
    currentUser = name;
    if(currentUser!=""){
      const bt = document.getElementById('bt');
      bt.innerText = "Change Name";
    }
    const user = document.getElementById('current-user');
    user.innerText = "Logged in as: "+currentUser;
    if(""===name){
      alert("Please enter a name");
      const bt = document.getElementById('bt');
      bt.innerText = "Enter discussion";
      window.location.href = '#';
    }else{
      data.user[userId] = {
        Name: name,
        id: userId,
        Avatar: "none"
      }
      this.nameInput.value = '';
      window.location.href = '#comment-section';
    }
  }
}


function setName(){
    const doc = document.getElementById('handle')
    new User(doc,userId);
    userId++;
}
function setComment() {
  const root = document.getElementById('comment-section')
  if(currentUser!=null){
    new Comment(root)
  }else{
    alert('set a name first');
    window.location.href = '#';
  }
}
