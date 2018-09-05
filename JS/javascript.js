let db;



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
  Avatar: Image,
  upvotes: Set()
  downvotes: Set()
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
        var date = new Date();
        const id = String(date);
        //console.log(date.getHours());
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        this.state = this.state.concat({comment, id})
        data.Comments[id] = {
          comment: comment,
          id: id,
          time: id,
          user: currentUser,
          votes: 0
        }

        // UI logic
        this.updateHelp()

        //creating elements
        const li = document.createElement('li')
        const Name = document.createElement('span');
        const span = document.createElement('span')
        const del = document.createElement('a')
        const rep = document.createElement('a')
        const time  = document.createElement('span');
        const vcont = document.createElement('span');
        const votes = document.createElement('span');
        const up = document.createElement('button');
        const down = document.createElement('button');

        //setting values
        vcont.classList.add('vcount');
        Name.innerText = currentUser
        Name.classList.add('title','username')

        const Ct = data.Comments[id]
        votes.classList.add('votes')
        votes.innerText = Ct.votes

        span.classList.add('comment')
        span.innerText = comment

        time.innerText = hours+":"+minutes
        time.classList.add('time')

        up.innerHTML = '&#x21e7';
        up.classList.add('btn-flat')
        up.addEventListener("click", function() {
          Ct.votes++;
          votes.innerText = Ct.votes
          up.classList.add('disabled');
          down.classList.remove('disabled');
        })
        up.classList.add('vbutton')

        down.innerHTML = '&#x21e9';
        down.classList.add('btn-flat')
        down.addEventListener("click", function() {
          Ct.votes--;
          votes.innerText = Ct.votes
          down.classList.add('disabled');
          up.classList.remove('disabled');
        })
        down.classList.add('vbutton')

        del.innerText = 'delete'
        del.setAttribute('data-delete-id',id)

        rep.innerText = "reply"
        rep.setAttribute('data-rep-id', id)
        rep.addEventListener("click", e => {
          e.preventDefault();
          console.log("I will write a reply");
        })

        li.classList.add('collection-item');


        //Putting elements in the dom
        this.ul.appendChild(li)
        li.appendChild(Name)
        li.appendChild(time)
        li.appendChild(document.createElement('br'))
        li.appendChild(del)
        li.appendChild(rep)
        li.appendChild(span)
        li.appendChild(vcont)
        vcont.appendChild(up)
        vcont.appendChild(votes)
        vcont.appendChild(down)
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
    this.nameInput = this.formName.querySelector('#name');
    this.emailInput = this.formName.querySelector('#email')
    this.passwordInput = this.formName.querySelector('#password')
    const name = this.nameInput.value;
    const email = this.emailInput.value;
    const password = this.passwordInput.value;
    currentUser = name;
    if(currentUser!="" && email!="" && password!=""){
      const bt = document.getElementById('bt');
      bt.innerText = "Logout";
    }
    const user = document.getElementById('current-user');
    user.innerText = "Logged in as: "+currentUser;
    if(""===name){
      alert("Please enter a name");
      const bt = document.getElementById('bt');
      bt.innerText = "Login";
      window.location.href = '#';
    }else{
      data.user[userId] = {
        Name: name,
        id: userId,
        email: email,
        password: password,
        upvotes: [],
        downvotes: [],
      }
      this.nameInput.value = '';
      this.emailInput.value = 'aj';
      this.passwordInput.value = 'ad';
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

window.onload = function(){
  let request = window.indexedDB.open('data',1);
  request.onerror = function(){
    console.log('Database failed to open');
  }
  request.onsuccess = function() {
    console.log('Database opened succesfully');
  }
  db = request.result;
  displayData();
}
