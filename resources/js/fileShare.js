const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#fileInput');
const browseBtn = document.querySelector('#browseBtn');

const bgProgress = document.querySelector('.bg-progress');
const progressPercent = document.querySelector('#progressPercent');
const progressContainer = document.querySelector('.progress-container');
const progressBar = document.querySelector('.progress-bar');
const status = document.querySelector('.status');
// const { response } = require('express');
// const { v4: uuid4 } = require('uuid');

const sharingContainer = document.querySelector('.sharing-container');
const copyURLBtn = document.querySelector('#copyURLBtn');
const fileURL = document.querySelector('#fileURL');
const emailForm = document.querySelector('#emailForm');

const toast = document.querySelector('.toast');

const baseURL ='http://localhost:3040';
const uploadURL = `${baseURL}/api/drug/files`;
const emailURL = `${baseURL}/api/drug/files/send`;

const maxAllowedSize = 100 * 1024 * 1024; //100mb


export function initFilesShare(){
    if(browseBtn){
        browseBtn.addEventListener("click", () => {
          fileInput.click();
      })
      }
      
      if(dropZone){
          dropZone.addEventListener("drop", (e) => {
              e.preventDefault();
              //   console.log("dropped", e.dataTransfer.files[0].name);
              const files = e.dataTransfer.files;
              if (files.length === 1) {
                if (files[0].size < maxAllowedSize) {
                  fileInput.files = files;
                  upload();
                } else {
                  showToast("Max File Size is 100 MB");
                }
              } else if (files.length > 1) {
                showToast("You can't Upload Multiple Files");
              }
              dropZone.classList.remove("dragged");
            })
      
          dropZone.addEventListener("dragover", (e) => {
              e.preventDefault();
              dropZone.classList.add("dragged");
          
           //  console.log("dropping file");
          })
          dropZone.addEventListener("dragleave", (e) => {
              dropZone.classList.remove("dragged");
           
          //    console.log("drag ended");
           })
      }
      
      //file input change and uploader
      if(fileInput){
        fileInput.addEventListener("change", () => {
          if (fileInput.files[0].size > maxAllowedSize) {
            showToast("Max File Size is 100 MB");
            fileInput.value = ""; // reset the input
            return;
          }
          upload();
        })
      }
      
        
        // sharing container listenrs
        if(copyURLBtn){
          copyURLBtn.addEventListener("click", () => {
            fileURL.select();
            document.execCommand("copy");
            showToast("Link Copied");
          })
        }
       
        if(fileURL){
          fileURL.addEventListener("click", () => {
            fileURL.select();
          })
        }
      
        
        const upload = () => {
          console.log("File Added Uploading");
        
          const files = fileInput.files;
          const formData = new FormData();
          formData.append("myfiles", files[0]);
        
          //show the uploader
          progressContainer.style.display = "block";
        
          // upload file
          const xhr = new XMLHttpRequest();
        
          // listen for upload progress
          xhr.upload.onprogress = function (event) {
            // find the percentage of uploaded
            let percent = Math.round((100 * event.loaded) / event.total);
            progressPercent.innerText = percent;
            const scaleX = `scaleX(${percent / 100})`;
            bgProgress.style.transform = scaleX;
            progressBar.style.transform = scaleX;
          }
        
          // handle error
          xhr.upload.onerror = function () {
            showToast(`Error in Upload: ${xhr.status}`);
            fileInput.value = ""; // reset the input
          };
        
          // listen for response which will give the link
          xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
              onFileUploadSuccess(xhr.responseText);
            }
          }
        
          xhr.open("POST", uploadURL);
          xhr.send(formData);
        }
        
        const onFileUploadSuccess = (res) => {
          fileInput.value = ""; // reset the input
          status.innerText = "Uploaded";
        
          // remove the disabled attribute from form btn & make text send
          emailForm[2].removeAttribute("disabled");
          emailForm[2].innerText = "Send";
          progressContainer.style.display = "none"; // hide the box
        
          const { file: url } = JSON.parse(res);
          console.log(url);
          sharingContainer.style.display = "block";
          fileURL.value = url;
        }
        
        if(emailForm){
          emailForm.addEventListener("submit", (e) => {
            e.preventDefault(); // stop submission
          
            // disable the button
            emailForm[2].setAttribute("disabled", "true");
            emailForm[2].innerText = "Sending";
          
            const url = fileURL.value;
          
            const formData = {
              uuid: url.split("/").splice(-1, 1)[0],
              emailTo: emailForm.elements["to-email"].value,
              emailFrom: emailForm.elements["from-email"].value,
            };
            console.log(formData);
            fetch(emailURL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  showToast("Email Sent");
                  sharingContainer.style.display = "none"; // hide the box
                }
              })
          })  
        }
        
        let toastTimer;
        // the toast function
        const showToast = (msg) => {
          clearTimeout(toastTimer);
          toast.innerText = msg;
          toast.classList.add("show");
          toastTimer = setTimeout(() => {
            toast.classList.remove("show");
          }, 2000);
        }
}