class FetchData {

  getResource = async url => { //url - входнойй параметр , когда функия асихронная, она возвращает промис
    const res = await fetch(url);

    if(!res.ok){
        throw new Error('Произошла ошибка' + res.status);
    }

    return res.json();//получаем даннеы в формет json
  }

  getPost = () => {
    return this.getResource('db/dataBase.json'); //путь относительно index.html, нео тносительно scripts.js 
  }
}

//console.log(sum(1,5).then(data => console.log(data)));

// new FetchData().getPost().then((data) =>  {
//   console.log(data);
// });//then() приимае  2 коллбэк функции, первая если промис будет успешен, вторая если не успешен




class Twitter{
    constructor({ user, listElem, modalElems, tweetElems, classDeleteTweet, classLikeTweet}){

      const fetchData = new FetchData();//создаем обхект
      this.user = user;
      this.tweets = new Posts();// создаем обхект, this.tweets все посты

      this.elements = { //поле объект
        listElem: document.querySelector(listElem),
        modal: modalElems, //массив обхектов
        tweetElems //массив обхектов
      }  

      this.class = {
        classDeleteTweet,
        classLikeTweet
      }

      fetchData.getPost() //data-[{},{},{},{}] массив объектов
        .then(data => {
            data.forEach(this.tweets.addPost)//берем твит, добавляем в пост
            this.showAllPost() //отображаем все посты
        });
        //console.log(this.tweets);

        this.elements.modal.forEach(this.handlerModal, this) //перебиоарем элементы массива modal& this перелаем  чтоб обратиться  к  handlerModal()
        this.elements.tweetElems.forEach(this.addTweet, this);
        this.elements.listElem.addEventListener('click', this.handlerTweet); //на спсико твитв(listElem) вешаем собтие
        
    
      }

    renderPosts(posts){//отображает все посты(твиты)
        this.elements.listElem.textContent = '';//удалеям посты

        posts.forEach(({ id, userName, nickname,  text, img, likes, getDate }) => { //еребиоаем все посты(твиты), дектсурткиризация
            //console.log(tweet)
            //вставляем li в спсико твитов ul, beforeend элеменыт добавляляются друг за дуржкой
            this.elements.listElem.insertAdjacentHTML('beforeend', `
              <li>
              <article class="tweet">
                <div class="row">
                  <img class="avatar" src="images/${nickname}.jpg" alt="Аватар пользователя ${nickname}">
                  <div class="tweet__wrapper">
                    <header class="tweet__header">
                      <h3 class="tweet-author">${userName}
                        <span class="tweet-author__add tweet-author__nickname">@${nickname}</span>
                        <time class="tweet-author__add tweet__date">${getDate()}</time>
                      </h3>
                      <button class="tweet__delete-button chest-icon" data-id="${id}"></button>
                    </header>
                    <div class="tweet-post">
                      <p class="tweet-post__text">${text}</p>
                      ${ img ? 
                        `<figure class="tweet-post__image">
                        <img src="${img}" alt="Сообщение Марии Lorem ipsum dolor sit amet, consectetur.">
                      </figure>` : ''} 
                    </div>
                  </div>
                </div>
                <footer>
                  <button class="tweet__like">
                    ${likes}
                  </button>
                </footer>
              </article>
            </li>
            `);
        })
    }

    showUserPost(){// при нажатии на кнопку Юзера открываюся посты только нашего пользвателя

    }

    showLikesPosts(){//отобазит все посты котрыя я лайкнула

    }
    
    showAllPost(){
      this.renderPosts(this.tweets.posts);
    }

    handlerModal({ button, modal, overlay, close }){ //пр нажатии на иконку пера, деструткуризация
        const buttonElem = document.querySelector(button);//кнпока Твитнуть
        const modalElem = document.querySelector(modal);//модалка
        const overlayElem = document.querySelector(overlay);
        const closeElem = document.querySelector(close);//кнпока закрытия (крестик)

        const openModal = () => {
            modalElem.style.display = 'block';
        }

        const closeModal = (elem, event) => {
            console.log(event); //event -  объект котрый возникает во время события, вданном случае клик
            const target = event.target; //то место куда кликнули
            
            if(target === elem){ //elem= элемент на котрый кликнули
              modalElem.style.display = 'none';
            }  
        }

        buttonElem.addEventListener('click', openModal); //после нажатия на кнпоку, вызовется фукнция openModal

        if(closeElem){//если кнопку полкучили
                                                        //bind() приязыает this
            closeElem.addEventListener('click', closeModal.bind(null, closeElem)); //после надатия на кнпоку закртия в окне, вызовктся фукнция closeModal
        }

        if(overlayElem){ 
            overlayElem.addEventListener('click', closeModal.bind(null, overlayElem)); //после надатия на кнпоку закртия в окне, вызовктся фукнция closeModal 
        }

        this.handlerModal.closeModal = () => {//функции добавили свойство closeModal так акак функяи это объект
            modalElem.style.display = 'none';
        } 
        
    }

    

    addTweet({ text, img, submit }){
        const textElem = document.querySelector(text); //текстария
        const imgElem = document.querySelector(img);//кнопка закгрузки фото
        const submitElem = document.querySelector(submit); //кнопка  отправки твита

        let imgUrl = '';
        let tempString = textElem.innerHTML;//поуичли верстку, котрую ввели в  поле тектсария

        submitElem.addEventListener('click', () => { //обработчик нажатия на кнопку Твинтуть
            this.tweets.addPost({ 
                userName: this.user.name, 
                nickname: this.user.nick,
                text: textElem.innerHTML, 
                img: imgUrl
            })

            this.showAllPost();
            this.handlerModal.closeModal(); //pfrhsdftv vjlfkre
            textElem.innerHTML = '';//после отправки сообщения очищвет теккстарию
          })

        textElem.addEventListener('click', () => { //по нажатию на текстраию, долны оищать ее если там есть текст
          if(textElem.innerHTML === tempString){
              textElem.innerHTML = '';//очищаем текстарию
          }
        })

        imgElem.addEventListener('click', () => { //обработик нажати яна кнопку загрузки фото imgElem
            imgUrl = prompt('Введите адрес картинки') //вызывает браузеное окно
        })

    }

    handlerTweet = (event) => { //у стрелочной фукнции нет this
      const target =  event.target; //верент селектор того элемент6 на котрый нажали
      console.log(event);
      // ниже это делегрирование, это когда на  что то одно навешиваем событие, а оно сработает на то что нажали
      if(target.classList.contains(this.class.classDeleteTweet)){ //есл target содержит класс удалени
          //console.log('Кнопка удаленич');
          this.tweets.deletePost(target.dataset.id);// в скобках получем значение дата атрибута data-id
      }

      if(target.classList.contains(this.class.classLikeTweet.like)){ //есл target содержит класс удалени
        console.log('Кнопка лфйк');
      }

    }

}



class Posts{ //tweets
    constructor({ posts  = [] } = {}){ //если постов нет, то присваеиваме путсой массив, если воообще объект не получили, то создаем путсой объект {}
        this.posts = posts; //this.posts будет массив
    }

    addPost = (tweets) => { //принимает объект { id, userName, nickname, postDate, text, img, likes = 0} , у стрклочной функции нет своего thisб он берет вызов выше
      this.posts.unshift(new Post(tweets)); //добавит пост в начало спсика
      //this.posts.push(new Post(tweets));// добавляем  создвнный post в массив this.tweets
    }

    deletePost(id){

    }

    likePost(id){

    }
}


class Post{
  constructor({ id, userName, nickname, postDate, text, img, likes = 0}){ //метод котрый вызывается при написании new Post и сощдается объект Post
    //const { id, userName, nickname, postDate, text, img, likes = 0} = param; //деструктуризация

    this.id = id || this.generateID();//вызываем фукнцию этого класса; если есть id(true), то вернет его, иначе выпонлит this.generateID()
    this.userName = userName;//param.username
    this.nickname = nickname; //создаем объект     
    this.postDate = postDate ? this.correctDate(postDate) : new Date();//если true, то вернет new Date(postDate), иначе  текущая дата  new Date()
    this.text = text;
    this.img = img;
    this.likes = likes;
    this.liked = false;
  }

  changeLike(){
    this.likes = !this.liked;

    if(this.liked){
        this.likes++;
    }
    else{
      this.likes--;
    }
  }

  generateID(){
    return (Math.random()).toString(32).substring(2) + (+new Date).toString();
  }

  getDate = () => {
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    return this.postDate.toLocaleString('ru-RU', options);
  }

  correctDate(date){
    if(isNaN(Date.parse(date))){
        console.log('Некорректная дата');
        date = date.replaceAll('.', '/'); ///\./g, '/'  точку менеят на слэш
    }
    return new Date(date); //возвращет объект
  }


}




const twitter = new Twitter({
  listElem: '.tweet-list', //класс из верстки, спсиок  твитов

  user: {
      name: 'Руфина',
      nick: 'Rufi'
  },

  modalElems: [
      { 
          button: '.header__link_tweet', //кнопка Твинуть
          modal: '.modal', //мод окно
          overlay: '.overlay',//тень вокруг окна
          close: '.modal-close__btn',//кнопка зактрытия модалки
      }
  ],

  tweetElems: [
    {
        text: '.modal .tweet-form__text',  //текстариа,, куда вводим текст
        img: '.modal .tweet-img__btn',
        submit: '.modal .tweet-form__btn',
    },
    {
      text: '.tweet-form__text',  //текстариа,, куда вводим текст
      img: '.tweet-img__btn',
      submit: '.tweet-form__btn',
    }
  ],
  classDeleteTweet:'tweet__delete-button', //кнопка удадения твита
  classLikeTweet: {
      like: 'tweet__like', //кнопка лайка
      active: 'tweet__like_active' //закрашенное сердечко
  }


})




// twitter.tweets.addPost({
//   username: 'Натали',
//   nickname: 'Nataly',
//   postDate: '01.19.2021',
//   text: 'супер идея',
//   img: '',
//   likes: '50',
//   liked: true,
// })

//console.log(twitter);

//console.log((+new Date).toString());
//console.log((Math.random()).toString(32).substring(2));



























//document.addEventListener('DOMContentLoaded', function({ //когда запустится  DOM , тогда фуния запутстся, но не будет рабоат с атриубетом async у тэка script

//}));


// const obj = {
//     firstname: 'Maks',
//     surname: 'Leskin',
//     // walk: function(steps){ //свойтсвом может явщяться и фунция
//     //     console.log(this.firstname + ' прошел ' + steps + 'шагов'); //this- обращаемся к текущему объекту
//     // }

// };

// //obj.walk(34); //вызываем фукнцию через объект

// const User = function(param){ //передаем объект, консруткор(он создает объект), задаем полям значения
//     this.firstname = param.firstname;
//     this.surname = param.surname;

//     this.walk = function(steps){ //свойтсвом может явщяться и фунция
//       console.log(this.firstname + ' прошел ' + steps + 'шагов '); //this- обращаемся к текущему объекту
//   };

// }

// User.prototype.coding = function(time){
//   console.log(this.firstname + ' писал код ' + time +  ' часов');
// }

// const maks = new User(obj);//содаем объект
// console.log(maks);
// //console.log(maks.surname);//обращаемся к свойству
// //console.log(maks.firstname);
// maks.walk(90);//вызываем функцию объекта

// const Rufina = new User({ //сохдает объект типа   User
//   firstname: 'Руфина',
//   surname: 'Давлетова' 
// });

// console.log(Rufina);
// //console.log(Rufina.firstname);
// Rufina.walk(67);
// Rufina.coding(4);

// //----------------------наследование:


// class Character { 
//   constructor(param){
//     this.name = param.name;
//     this.server = param.server;
//     this.gender = param.gender;
//   }

//   walk(){
//     console.log(this.name + ' идет');
//   };

//   run(){
//     console.log(this.name + ' бежит');
//   };


  
// };



// class Race extends Character{  //класс Race наследует  класс Character

//   constructor(param){
//     super(param); //здесь все поля кдасса Character передкт к классу Race
//     this.race = param.race;

//   }
  
//   mainskill = function(){
//     console.log(this.race + this.name + ' используй суперспособность');
//   };

// };



// class Class extends Race{ //
//   constructor(param){
//     super(param);//вызов класса родителя(Race)
//     this.classs = param.classs;
//   }
  
//   specialskill(){
//     if(this.classs === 'war'){
//         return 'Рассекающий удар мечом';
//     }
  
//   }

//   classSkill(){
//       //console.log(this.name + ' используй классовую способность');
//       console.log(`${this.race} ${this.name} ${this.classs} наносит ${this.specialskill()}`);
//   }
  
  
// };



// //const char = new Character({});
// //const race = new Race({});
// const war  = new Class({ //создаем объект war 
//     name: 'МксВАи',
//     server: 'эпический',
//     gender: 'Муж',
//     race: 'Орк',
//     classs: 'war' 
// });

// console.log(war);

// console.log(war.specialskill());
