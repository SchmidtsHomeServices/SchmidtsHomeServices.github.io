$(document).ready(function() {
	const nav = $("#navigation");
	
})

let menu = document.querySelector('#toggler');
menu.onclick = () =>{
    menu.classList.toggle('fa-times');
}

var gallerySlider = tns({
     container: ".gallery-slider",
     items: 40,
     slideBy: 1,
     controlsPosition: "bottom",
     navPosition: "bottom",
     mouseDrag: true,
     autoplay: true,
     autoplayButtonOutput: false,
     controlsContainer: "#gallery-control",
    responsive: {
        1600: {
            items: 4,
            gutter: 20
        },
        1024: {
            items: 3,
            gutter: 20
        },
        768: {
            items: 2,
            gutter: 20
        },
        480: {
            items: 1
        },
        300: {
            items: 1
        }
    }
})



let DB;

let form = document.querySelector('form');
let firstName = document.querySelector('#first-name');
let lastName = document.querySelector('#last-name');
let phone = document.querySelector('#phone');
let email = document.querySelector('#email');
let address = document.querySelector('#address');
let date = document.querySelector('#date');
let time = document.querySelector('#time');
let service = document.querySelector('#service');
let message = document.querySelector('#message');
let consultations = document.querySelector('#consultations');
let services = document.querySelector('#services');

document.addEventListener('DOMContentLoaded', () => {
     // create the database
     let ScheduleDB = window.indexedDB.open('consultations', 1);

     // if there's an error
     ScheduleDB.onerror = function() {
          console.log('error');
     }
      
     ScheduleDB.onsuccess = function() {
          DB = ScheduleDB.result;
          showConsultations();
     }
   
     ScheduleDB.onupgradeneeded = function(e) {
          let db = e.target.result;          
          let objectStore = db.createObjectStore('consultations', { keyPath: 'key', autoIncrement: true } );

          objectStore.createIndex('firstname', 'firstname', { unique: false } );
          objectStore.createIndex('lastname', 'lastname', { unique: false } );
          objectStore.createIndex('phone', 'phone', { unique: false } );
          objectStore.createIndex('email', 'email', { unique: false } );
          objectStore.createIndex('address', 'address', { unique: false } );
          objectStore.createIndex('date', 'date', { unique: false } );
          objectStore.createIndex('time', 'time', { unique: false } );
          objectStore.createIndex('service', 'service', { unique: false } );
          objectStore.createIndex('message', 'message', { unique: false } );

          //console.log('Database ready and fields created!');
     }

     form.addEventListener('submit', addConsultations);

     function addConsultations(e) {
          e.preventDefault();
          let newConsultation = {
               firstname : firstName.value,
               lastname : lastName.value,               
               phone : phone.value,
               email : email.value,
               address : address.value,
               date : date.value,
               time : time.value,
               service : service.value,
               message : message.value
          }
          
          let transaction = DB.transaction(['consultations'], 'readwrite');
          let objectStore = transaction.objectStore('consultations');
          let request = objectStore.add(newConsultation);
               request.onsuccess = () => {
                    form.reset();
          }
          transaction.oncomplete = () => {
               //console.log('New appointment added');
               showConsultations();
          }
          transaction.onerror = () => {
              //console.log();
          }

     }
     function showConsultations() {
       
          while(consultations.firstChild) {
               consultations.removeChild(consultations.firstChild);
          }
         
          let objectStore = DB.transaction('consultations').objectStore('consultations');

          objectStore.openCursor().onsuccess = function(e) {
               
               let cursor = e.target.result;
               if(cursor) {
                    let ConsultationHTML = document.createElement('li');
                    ConsultationHTML.setAttribute('data-consultation-id', cursor.value.key);
                    ConsultationHTML.classList.add('list-group-item');   
                    ConsultationHTML.innerHTML = `  
                         <p class="font-weight-bold">First Name :  <span class="font-weight-normal">${cursor.value.firstname}<span></p>
                         <p class="font-weight-bold">Last Name :  <span class="font-weight-normal">${cursor.value.lastname}<span></p>
                         <p class="font-weight-bold">Phone Number :  <span class="font-weight-normal">${cursor.value.phone}<span></p>
                         <p class="font-weight-bold">Email Address :  <span class="font-weight-normal">${cursor.value.email}<span></p>
                         <p class="font-weight-bold">Property Address :  <span class="font-weight-normal">${cursor.value.address}<span></p>
                         <p class="font-weight-bold">Date :  <span class="font-weight-normal">${cursor.value.date}<span></p>
                         <p class="font-weight-bold">Time :  <span class="font-weight-normal">${cursor.value.time}<span></p>
                         <p class="font-weight-bold">Serice :  <span class="font-weight-normal">${cursor.value.service}<span></p>
                         <p class="font-weight-bold">Message :  <span class="font-weight-normal">${cursor.value.message}<span></p>
                    `;

                    
                    const cancelBtn = document.createElement('button');
                    cancelBtn.classList.add('btn', 'btn-danger');
                    cancelBtn.innerHTML = 'Cancel';
                    cancelBtn.onclick = removeConsultation;
                    ConsultationHTML.appendChild(cancelBtn);
                    consultations.appendChild(ConsultationHTML);
                    cursor.continue();
               } else {
                    if(!consultations.firstChild) {
                         services.textContent = 'Your Appointments';
                         let noSchedule = document.createElement('p');
                         noSchedule.classList.add('text-center');
                         noSchedule.textContent = 'No results Found';
                         consultations.appendChild(noSchedule);
                    } else {
                         services.textContent = 'Your Appointments'
                    }
               }
          }
     }

          function removeConsultation(e) {
       
          let scheduleID = Number( e.target.parentElement.getAttribute('data-consultation-id') );
          let transaction = DB.transaction(['consultations'], 'readwrite');
          let objectStore = transaction.objectStore('consultations');
          objectStore.delete(scheduleID);
          transaction.oncomplete = () => {
               e.target.parentElement.parentElement.removeChild( e.target.parentElement );
               if(!consultations.firstChild) {
                    services.textContent = 'Your Appointments' ;
                    let noSchedule = document.createElement('p');
                    noSchedule.classList.add('text-center');
                    noSchedule.textContent = 'No results Found';
                    consultations.appendChild(noSchedule);
               } else {
                    services.textContent = 'Your Appointments'
               }
          }
     }

});

form.addEventListener('submit', sendEmail);

function sendEmail() {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    email: 'joshua@schmidtshomeservices.com',
    html:
      'First Name: ' +
      document.getElementById('first-name').value +
      '<br> Last Name: ' +
      document.getElementById('last-name').value +
      '<br> Phone Number: ' +
      document.getElementById('phone').value +
      '<br> Email Address: ' +
      document.getElementById('email').value +
      '<br> Property Address: ' +
      document.getElementById('address').value +
      '<br> Date: ' +
      document.getElementById('date').value +
      '<br> Time: ' +
      document.getElementById('time').value +
      '<br> Service: ' +
      document.getElementById('service').value +
      '<br> Message: ' +
      document.getElementById('message').value,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch('https://barry-dev-mail-app.herokuapp.com/mail', requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      alert('Appointment Request Successful');
    })
    .catch((error) => console.log('error', error));
}

