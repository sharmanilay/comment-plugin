// Global varialbles
var data = {
  Comments: [],
  user: []
}
var items = {}
this.state = []
var currentUser;
var replyId;
var reader = new FileReader();
var width;

window.onload = function() {
  width = window.innerWidth
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
  var nav = document.querySelectorAll('.sidenav');
  var navitems = M.Sidenav.init(nav);
  if(window.innerWidth<600){
    const loginDiv = document.getElementById('remove-mb');
    const home = document.getElementById('home');
    const homeMain = document.getElementById('home-main');
    home.removeChild(loginDiv);
    homeMain.classList.remove('s6');
    homeMain.classList.add('s12');
  }
  var datas = JSON.parse(localStorage.getItem('data'));
  if (datas != null) {
    data = datas;
    printComments();
  }
}
window.onresize = function () {
  var newWidth = window.innerWidth;
  if(window.innerWidth<600 && width-newWidth!=0){
    const loginDiv = document.getElementById('remove-mb');
    const home = document.getElementById('home');
    const homeMain = document.getElementById('home-main');
    home.removeChild(loginDiv);
    homeMain.classList.remove('s6');
    homeMain.classList.add('s12');
  }

  if(newWidth>600 && document.getElementById('remove-mb')==null){
    width = newWidth;
    const home = document.getElementById('home');
    const homeMain = document.getElementById('home-main');
    const loginDiv = document.createElement('div');
    const heading = document.createElement('h2');


    loginDiv.setAttribute('id','remove-mb');
    loginDiv.classList.add('col', 's6');

    heading.innerText = "Login to discuss"
    heading.classList.add('heading');
    loginDiv.appendChild(heading)

    home.insertBefore(loginDiv,home.childNodes[0]);
    homeMain.classList.remove('s12');
    homeMain.classList.add('s6');
  }
}


class Comment {
  constructor(root) {
    //UI varialbles
    this.root = root;
    this.form = root.querySelector('form');
    this.input = this.form.querySelector('input');
    this.ul = root.querySelector('ul');
    // event handlers
    this.form.addEventListener('submit', e => {
      e.preventDefault()
      const comment = this.input.value
      this.input.value = ''
      if (comment != "") {
        addComment(comment,false,this.ul);
      }
    })
    this.ul.addEventListener('click', e => {
      e.preventDefault();
      const id = e.target.getAttribute('data-delete-id')
      if (!id) return // user clicked in something else
      removeComment(id)
    })
  }
}

class User {
  constructor(doc) {
    //intialization
    this.doc = doc;
    this.formName = doc.querySelector('form');
    this.nameInput = this.formName.querySelector('#name');
    this.emailInput = this.formName.querySelector('#email')
    this.passwordInput = this.formName.querySelector('#password')
    this.avatar = document.getElementById('tableAvatar')
    const name = this.nameInput.value;
    const email = this.emailInput.value;
    const password = this.passwordInput.value;
    const img = this.avatar.src
    this.passwordInput.value = '';
    var u = data.user.find((u) => {
      if (u.email == email) {
        return u
      }
      return null;
    })

    if (u != null) {
      const alert = document.getElementById('helper-txt');
      if (u.user == name && u.password == password) {
        setCurrentUser(u);
        const bt = document.getElementById('bt');
        bt.innerText = "Logout";
        this.nameInput.disabled = true;
        this.emailInput.disabled = true;
        this.passwordInput.disabled = true;
        alert.innerText = "Logged in"
      } else if (u.user != name) {
        this.emailInput.value = "Email already in use!";
      } else if (u.password != password) {
        alert.innerText = "Wrong Password!"
      }
    } else {
      if (name != "" && (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) && password != "" && bt.innerText != "Logout") {
        const bt = document.getElementById('bt');
        bt.innerText = "Logout";
        const upvotes = [];
        const downvotes = [];
        const dat = new Date();
        const u = {
          user: name,
          id: String(dat),
          avatar: img,
          email: email,
          password: password,
          upvotes: upvotes,
          downvotes: downvotes,
        }
        setCurrentUser(u);
        this.nameInput.disabled = true;
        this.emailInput.disabled = true;
        this.passwordInput.disabled = true;
      }else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
        this.emailInput.value = "Please Enter a valid email"
      }else if ("" === name) {
        const bt = document.getElementById('bt');
        bt.innerText = "Login";
        window.location.href = '#';
      }
    }
  }
}

function addComment(comment,isReply,parent) {
  // state logic
  var date = new Date();
  const id = String(date);
  var ul;
  var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  state = state.concat({
    comment,
    id
  })
  var cmt = {}
  if(!isReply){
      cmt = {
        comment: comment,
        id: id,
        time: id,
        user: currentUser.user,
        userId: currentUser.id,
        img: currentUser.avatar,
        replies: [],
        votes: 0,
        isReply: false,
      }
      ul = document.getElementById('cs-ul')
  }else{
      ul =  parent.querySelector('#reply-ul');
      if(currentUser!=null){
        cmt = {
          comment: comment,
          id: id,
          time: id,
          user: currentUser.user,
          userId: currentUser.id,
          img: currentUser.avatar,
          replies: [],
          votes: 0,
          isReply: true,
        }
      }else{
        //console.log(comment.comment)
        cmt = data.Comments.find(item => item.comment === comment.comment)
      }
      const pid = parent.getAttribute('id');
      const parot = data.Comments.find((item)=> item.id==pid)
      const cid = parot.replies.find((item)=> item.id==cmt.id);
      if(cid==null){
        parot.replies.push(cmt.id);
      }
  }
    updateHelp()
    const check = data.Comments.find((item)=> item==cmt)
    if(check==null){
      data.Comments = data.Comments.concat(cmt);
      localStorage.setItem('data', JSON.stringify(data));
    }
    const li = updateUI(cmt);
    li.setAttribute('id',cmt.id);
    const dcheck = document.getElementById(cmt.id);
    if(dcheck===null){
      //console.log("recalled "+cmt.comment)
      ul.appendChild(li);
      ul.classList.add('replies')
    }
}

function setCurrentUser(u) {
  const user = document.getElementById('current-user');
  currentUser = u;
  user.innerText = "Logged in as: " + currentUser.user;
  if (!data.user.includes(currentUser)) {
    data.user = data.user.concat(currentUser);
    localStorage.setItem('data', JSON.stringify(data));
  }
  window.location.href = '#comment-section';
}

function setName() {
  const doc = document.getElementById('handle')
  const bt = document.getElementById('bt');
  if (currentUser != null) {
    currentUser = null;
    /*this.formName = doc.querySelector('form');
    this.nameInput = this.formName.querySelector('#name');
    this.emailInput = this.formName.querySelector('#email')
    this.passwordInput = this.formName.querySelector('#password')
    const alert = document.getElementById('helper-txt');
    alert.innerText = ''
    this.nameInput.disabled = false;
    this.emailInput.disabled = false;
    this.passwordInput.disabled = false;
    this.passwordInput.value = '';
    this.nameInput.value = '';
    this.emailInput.value = '';
    bt.innerText="Login";
    const user = document.getElementById('current-user');
    user.innerText = 'Log in to comment'
    */
    window.location.reload(true);
  } else {
    new User(doc);
  }
}

function setComment() {
  const root = document.getElementById('comment-section')
  if (currentUser != null) {
    new Comment(root)
  } else {
    const btt = document.getElementById('comment-reply')
    btt.classList.add('modal-trigger')
    btt.setAttribute('data-target', 'modal2')
    window.location.href = '#';
  }
}

function updateHelp() {
  const root = document.getElementById('comment-section')
  this.help = root.querySelector('.help');
  if (state.length > 0) {
    this.help.classList.add('hidden')
  } else {
    this.help.classList.remove('hidden')
  }
}

function updateUI(cmt) {
  const root = document.getElementById('comment-section')
  const Ct = cmt;
  let replies = cmt.replies;
  var date = new Date(cmt.id)
  //var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  //var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

  //creating elements
  const li = document.createElement('li')
  const Name = document.createElement('span');
  const span = document.createElement('span')
  const rep = document.createElement('button')
  const del = document.createElement('a')
  const time = document.createElement('span');
  const vcont = document.createElement('span');
  const votes = document.createElement('span');
  const up = document.createElement('button');
  const down = document.createElement('button');
  const ul = document.createElement('ul');
  const avt = document.createElement('img');
  ul.setAttribute('id','reply-ul')

  avt.src = Ct.img;
  avt.classList.add('cmt-avatar', 'square', 'responsive-img');


  //setting up a list-item
  li.classList.add('collection-item');
  li.setAttribute('id', cmt.id)
  li.setAttribute('user-id', cmt.userId)
  //setting values
  vcont.classList.add('vcount');
  Name.innerText = Ct.user
  Name.classList.add('title', 'username')

  //delete comment button
  del.innerText = 'delete'
  del.setAttribute('data-delete-id', cmt.id)
  del.addEventListener("click", () => {
    const id = del.getAttribute('data-delete-id')
    if (!id) return
    removeComment(id);
  })

  //votes
  votes.classList.add('votes')
  votes.innerText = Ct.votes

  //Comment
  span.classList.add('comment')
  span.innerText = cmt.comment

  //time
  time.innerText = timeSince(date)   //hours + ":" + minutes
  time.classList.add('time')

  //upvote
  up.innerHTML = '&#x21e7';
  up.classList.add('btn-flat')
  up.addEventListener("click", function() {
    if (currentUser != null) {
      const user = data.user.find((user) => user.id == currentUser.id)
      var upvotes = new Set();
      user.upvotes.forEach((id) => {
        upvotes.add(id);
      })
      //upvotes.add(user.upvotes);
      var downvotes = new Set();
      user.downvotes.forEach((id) => {
        downvotes.add(id);
      })
      //downvotes.add(user.downvotes);
      if (!downvotes.size && !upvotes.size) {
        votes.classList.add('green');
        Ct.votes++;
        upvotes.add(Ct.id);
      }
      if (downvotes.has(cmt.id)) {
        votes.classList.remove('red');
        votes.classList.add('green');
        Ct.votes += 2;
        downvotes.delete(cmt.id);
        upvotes.add(cmt.id);
      }
      if (!upvotes.has(cmt.id)) {
        votes.classList.add('green');
        Ct.votes++;
        upvotes.add(cmt.id);
      }
      user.downvotes = [];
      user.downvotes = [...downvotes];
      user.upvotes = [];
      user.upvotes = [...upvotes];
      localStorage.setItem('data', JSON.stringify(data));
      votes.innerText = Ct.votes
      up.classList.add('disabled');
      down.classList.remove('disabled');
    }
  })
  up.classList.add('ubutton')

  //downvote
  down.innerHTML = '&#x21e9';
  down.classList.add('btn-flat')
  down.setAttribute('id', cmt.id)
  down.addEventListener("click", function() {
    if (currentUser != null) {
      const user = data.user.find((user) => user.id == currentUser.id)
      var upvotes = new Set();
      user.upvotes.forEach((id) => {
        upvotes.add(id);
      })
      //upvotes.add(user.upvotes);
      var downvotes = new Set();
      user.downvotes.forEach((id) => {
        downvotes.add(id);
      })
      //downvotes.add(user.downvotes);


      if (!downvotes.size && !upvotes.size) {
        votes.classList.add('red');
        Ct.votes--;
        downvotes.add(Ct.id);
      }
      if (upvotes.has(cmt.id)) {
        votes.classList.add('red');
        votes.classList.remove('green');
        Ct.votes -= 2;
        upvotes.delete(cmt.id);
        downvotes.add(cmt.id);
      }
      if (!downvotes.has(cmt.id)) {
        votes.classList.add('red');
        Ct.votes--;
        downvotes.add(cmt.id);
      }
      user.upvotes = [];
      user.upvotes = [...upvotes]
      user.downvotes = []
      user.downvotes = [...downvotes]
      localStorage.setItem('data', JSON.stringify(data));
      //console.log(user.downvotes.size);
      votes.innerText = Ct.votes
      //down.classList.add('disabled');
      //up.classList.remove('disabled');
    }
  })
  down.classList.add('ubutton')


  //reply
  rep.innerText = "reply"
  rep.setAttribute('data-rep-id', cmt.id)
  rep.setAttribute('data-target', 'modal1')
  rep.classList.add('vbutton', 'modal-trigger')
  rep.classList.add('modal-trigger')
  rep.addEventListener("click", e => {
    e.preventDefault();
    const mc = document.getElementById('mc')
    const rcButton = document.getElementById('rp-button')
    if (currentUser != null) {
      mc.innerText = "";
      rcButton.innerText = "Add Reply"
      const form = document.createElement('form')
      const input = document.createElement('input')
      input.setAttribute('id', 'reply-comment')
      input.setAttribute('placeholder', 'add a reply')
      form.appendChild(input)
      mc.appendChild(form)
      const id = rep.getAttribute('data-rep-id');
      replyId = id;
    } else {
      mc.innerText = "Please Login to write a reply";
      rcButton.innerText = "Login";
    }

  })


  //Putting elements in the dom
  li.appendChild(avt)
  li.appendChild(Name)
  li.appendChild(time)
  li.appendChild(document.createElement('br'))
  li.appendChild(del)
  if (currentUser == null || cmt.user == currentUser.user) {
    del.classList.add('hidden');
  }
  li.appendChild(span)
  li.appendChild(rep)
  li.appendChild(vcont)
  vcont.appendChild(up)
  vcont.appendChild(votes)
  vcont.appendChild(down)
  li.appendChild(ul);

  replies.forEach((cmtId) => {
    const rcmt = data.Comments.find((item) => item.id == cmtId);
    const dcheck = document.getElementById(cmt.id);
    if(dcheck===null){
      setTimeout(()=>{
        addComment(rcmt,true,li);
      })
    }
  });
  items[cmt.id] = li

  return li;
}

function removeComment(id) {
  const root = document.getElementById('comment-section')
  this.ul = root.querySelector('ul');
  const li = items[id]
  this.state = this.state.filter(item => item.id !== id)
  data.Comments = data.Comments.filter(item => item.id !== id)
  localStorage.setItem('data', JSON.stringify(data));
  this.updateHelp()
  this.ul.removeChild(li)
}

function setReply() {
  this.inputValue = document.getElementById('reply-comment')
  if(this.inputValue!=null){
    const reply = this.inputValue.value;
    const cmt = data.Comments.find((cmt) => cmt.id == replyId)
    const parent = document.getElementById(replyId);
    addComment(reply,true,parent);
  }
}

function printComments() {
  let Comments = data.Comments;
  const ul = document.getElementById('cs-ul')
  Comments.forEach((cmt) => {
    const item = cmt;
    const dcheck = document.getElementById(cmt.id);
    if(!item.isReply && dcheck===null){
      const li = updateUI(item)
      ul.appendChild(li);
    }
  })
}

function previewFile() {
  var avatar = document.getElementById('tableAvatar')
  var file = document.querySelector('input[type=file]').files[0];
  if (file) {
    reader.readAsDataURL(file);
  } else {
    avatar.src = "";
  }
  reader.onloadend = function() {
    avatar.src = reader.result;
  }
}

function timeSince(timeStamp) {
		var now = new Date(),
			secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;

		var formatDate = function(date, format, utc) {
			var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

			function ii(i, len) {
				var s = i + "";
				len = len || 2;
				while (s.length < len) s = "0" + s;
				return s;
			}

			var y = utc ? date.getUTCFullYear() : date.getFullYear();
			format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
			format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
			format = format.replace(/(^|[^\\])y/g, "$1" + y);

			var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
			format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
			format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
			format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
			format = format.replace(/(^|[^\\])M/g, "$1" + M);

			var d = utc ? date.getUTCDate() : date.getDate();
			format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
			format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
			format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
			format = format.replace(/(^|[^\\])d/g, "$1" + d);

			var H = utc ? date.getUTCHours() : date.getHours();
			format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
			format = format.replace(/(^|[^\\])H/g, "$1" + H);

			var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
			format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
			format = format.replace(/(^|[^\\])h/g, "$1" + h);

			var m = utc ? date.getUTCMinutes() : date.getMinutes();
			format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
			format = format.replace(/(^|[^\\])m/g, "$1" + m);

			var s = utc ? date.getUTCSeconds() : date.getSeconds();
			format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
			format = format.replace(/(^|[^\\])s/g, "$1" + s);

			var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
			format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
			f = Math.round(f / 10);
			format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
			f = Math.round(f / 10);
			format = format.replace(/(^|[^\\])f/g, "$1" + f);

			var T = H < 12 ? "AM" : "PM";
			format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
			format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

			var t = T.toLowerCase();
			format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
			format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

			var tz = -date.getTimezoneOffset();
			var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
			if (!utc) {
				tz = Math.abs(tz);
				var tzHrs = Math.floor(tz / 60);
				var tzMin = tz % 60;
				K += ii(tzHrs) + ":" + ii(tzMin);
			}
			format = format.replace(/(^|[^\\])K/g, "$1" + K);

			var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
			format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
			format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

			format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
			format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

			format = format.replace(/\\(.)/g, "$1");

			return format;
		};

		if(secondsPast < 60){ // Less than a minute
			return parseInt(secondsPast) + 's' + ' ago';
		}
		if(secondsPast < 3600){ // Less than an hour
			return parseInt(secondsPast/60) + 'm'+ ' ago';
		}
		if(secondsPast <= 86400){ // Less than a day
			return parseInt(secondsPast/3600) + 'h'+ ' ago';
		}
		if(secondsPast <= 172800){ // Less than 2 days
			return '1d ago (' + formatDate(timeStamp, "h:mmtt")+')';
		}
		if(secondsPast > 172800){ // After two days
			var timeString;

			if(secondsPast <= 604800)
				timeString = formatDate(timeStamp, "dddd") + " at " + formatDate(timeStamp, "h:mmtt") // with in a week
			else if(now.getFullYear() > timeStamp.getFullYear())
				timeString = formatDate(timeStamp, "MMMM d, yyyy") // a year ago
			else if(now.getMonth() > timeStamp.getMonth())
				timeString = formatDate(timeStamp, "MMMM d") // months ago
			else
				timeString = formatDate(timeStamp, "MMMM d") + " at " + formatDate(timeStamp, "h:mmtt") // with in a month

			return timeString;
		}
}
