// Global varialbles
var data = {
  Comments: [],
  user: []
}
var items = {}
this.state = []
var currentUser;

class Comment {
  constructor(root) {
      //UI varialbles
      this.root  = root;
      this.form = root.querySelector('form');
      this.input = this.form.querySelector('input');
      this.ul = root.querySelector('ul');
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
        removeComment(id)
      })
    }
      addComment(comment){
        // state logic
        var date = new Date();
        const id = String(date);
        //console.log(date.getHours());
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        state = state.concat({comment, id})
        var cmt = {
          comment: comment,
          id: id,
          time: id,
          user: currentUser,
          replies: [],
          votes: 0
        }
        data.Comments = data.Comments.concat(cmt);

        localStorage.setItem('data', JSON.stringify(data));

        updateHelp()
        updateUI(cmt);
      }
}

class User {
  constructor(doc) {
    this.doc = doc;
    this.formName = doc.querySelector('form');
    this.nameInput = this.formName.querySelector('#name');
    this.emailInput = this.formName.querySelector('#email')
    this.passwordInput = this.formName.querySelector('#password')
    const name = this.nameInput.value;
    const email = this.emailInput.value;
    const password = this.passwordInput.value;
    this.passwordInput.value = '';
    if(data.user.find((u)=>{
      if(u.email==email){
        return true;
      }
      return false
    })){
      this.emailInput.value = 'Email already in use!!';
    }else{
        if(currentUser!="" && email!="" && password!="" && bt.innerText!="Logout"){
          currentUser = name;
          const bt = document.getElementById('bt');
          bt.innerText = "Logout";
          this.nameInput.disabled = true;
          this.emailInput.disabled = true;
          this.passwordInput.disabled = true;
        }
        const user = document.getElementById('current-user');
        user.innerText = "Logged in as: "+currentUser;
      if(""===name){
        alert("Please enter a name");
        const bt = document.getElementById('bt');
        bt.innerText = "Login";
        window.location.href = '#';
      }else{
        const upvotes = new Set();
        const downvotes = new Set();
        const dat = new Date();
        data.user = data.user.concat({
          Name: name,
          id: String(dat),
          email: email,
          password: password,
          upvotes: upvotes,
          downvotes: downvotes,
        });
        localStorage.setItem('data', JSON.stringify(data));
        window.location.href = '#comment-section';
      }
    }
  }
}


function setName(){
    const doc = document.getElementById('handle')
    const bt = document.getElementById('bt');
    if(currentUser!=null){
      currentUser = null;
      this.formName = doc.querySelector('form');
      this.nameInput = this.formName.querySelector('#name');
      this.emailInput = this.formName.querySelector('#email')
      this.passwordInput = this.formName.querySelector('#password')
      this.passwordInput.value = '';
      this.nameInput.value = '';
      this.emailInput.value = '';
      bt.innerText="Login";
      const user = document.getElementById('current-user');
      user.innerText = 'Log in to comment'
    }else{
      new User(doc);
    }
}
function setComment() {
  const root = document.getElementById('comment-section')
  if(currentUser!=null){
    new Comment(root)
  }else{
    const btt = document.getElementById('comment-reply')
    btt.classList.add('modal-trigger')
    btt.setAttribute('data-target','modal1')
    window.location.href = '#';
  }
}
function updateHelp(){
  const root = document.getElementById('comment-section')
  this.help = root.querySelector('.help');
  if(state.length >0){
    this.help.classList.add('hidden')
  }else {
    this.help.classList.remove('hidden')
  }
}
function updateUI(cmt) {
  const root = document.getElementById('comment-section')
  this.ul = root.querySelector('ul');
  const Ct = cmt;
  var date = new Date(cmt.id)
  var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

  //creating elements
  const li = document.createElement('li')
  const Name = document.createElement('span');
  const span = document.createElement('span')
  const rep = document.createElement('button')
  const del = document.createElement('a')
  const time  = document.createElement('span');
  const vcont = document.createElement('span');
  const votes = document.createElement('span');
  const up = document.createElement('button');
  const down = document.createElement('button');
  const ul = document.createElement('ul');

  Ct.replies.forEach((replyId)=>{
    const rId = data.Comments.find((item)=> item.id==replyId);

  })
  //setting up a list-item
  li.classList.add('collection-item');
  li.setAttribute('id',cmt.id)

  //setting values
  vcont.classList.add('vcount');
  Name.innerText = Ct.user
  Name.classList.add('title','username')

  //delete comment button
  del.innerText = 'delete'
  del.setAttribute('data-delete-id',cmt.id)
  del.addEventListener("click",()=>{
    const id = del.getAttribute('data-delete-id')
    if(!id)return
    removeComment(id);
  })

  //votes
  votes.classList.add('votes')
  votes.innerText = Ct.votes

  //Comment
  span.classList.add('comment')
  span.innerText = cmt.comment

  //time
  time.innerText = hours+":"+minutes
  time.classList.add('time')

  //upvote
  up.innerHTML = '&#x21e7';
  up.classList.add('btn-flat')
  up.addEventListener("click", function() {
    Ct.votes++;
    votes.innerText = Ct.votes
    up.classList.add('disabled');
    down.classList.remove('disabled');
  })
  up.classList.add('vbutton')

  //downvote
  down.innerHTML = '&#x21e9';
  down.classList.add('btn-flat')
  down.addEventListener("click", function() {
    Ct.votes--;
    votes.innerText = Ct.votes
    down.classList.add('disabled');
    up.classList.remove('disabled');
  })
  down.classList.add('vbutton')


  //reply
  rep.innerText = "reply"
  rep.setAttribute('data-rep-id', cmt.id)
  rep.setAttribute('data-target','modal1')
  rep.classList.add('vbutton','modal-trigger')
  rep.classList.add('modal-trigger')
  rep.addEventListener("click", e => {
    e.preventDefault();
    const mc = document.getElementById('mc')
    const rcButton = document.getElementById('rp-button')
    if(currentUser!=null){
      const id = rep.getAttribute('data-rep-id');
      const rc = data.user.find((user)=> user.id==id);
    }else{
      mc.innerText = "Please Login to write a reply";
      rcButton.innerText = "Login";
    }

  })




  //Putting elements in the dom
  this.ul.appendChild(li)
  li.appendChild(Name)
  li.appendChild(time)
  li.appendChild(document.createElement('br'))
  if(cmt.user==currentUser){
    li.appendChild(del)
  }
  li.appendChild(rep)
  li.appendChild(span)
  li.appendChild(vcont)
  vcont.appendChild(up)
  vcont.appendChild(votes)
  vcont.appendChild(down)
  items[cmt.id] = li
}
function removeComment(id) {
  const root = document.getElementById('comment-section')
  this.ul = root.querySelector('ul');
  const li = items[id]
  this.state = this.state.filter(item => item.id!==id)
  data.Comments = data.Comments.filter(item => item.id!==id)
  localStorage.setItem('data', JSON.stringify(data));
  this.updateHelp()
  this.ul.removeChild(li)
}
window.onload = function () {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
  var datas = JSON.parse(localStorage.getItem('data'));
  if(datas!=null){
    data = datas;
    printComments();
  }
}

function printComments(){
  let Comments = data.Comments;
  Comments.forEach((cmt)=>{
    updateUI(cmt)
  })
}
