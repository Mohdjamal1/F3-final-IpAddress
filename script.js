let h1Ele = document.getElementById('ipAdd');
let ipAddress='';
//Fetching the IP Address.
fetch("https://api.ipify.org/?format=json")
    .then((res) => res.json())
    .then((data) => {
    ipAddress = data.ip;
    console.log(ipAddress);
    h1Ele.innerText = `MY Public IP ADDRESS : ${ipAddress}`;
})
.catch(err =>{
    h1Ele.innerText = `MY Public IP ADDRESS ${err}`;
    console.error("Error:"+err);
})

let btn = document.getElementById('getData-btn');
    btn.addEventListener('click',(event)=>{
        // event.preventDefault();
    getData();
    
    document.getElementById('container').style.display = 'block';
    document.getElementById('getData-btn').style.display = 'none';
})
let frame = document.getElementById('frame');


async function getData() {
    let response = await fetch(`https://ipinfo.io/${ipAddress}/json?token=635888b56e44b1`);
    let data = await response.json();
    const lat = data.loc.split(",")[0];
    const long = data.loc.split(",")[1];
    frame.setAttribute('src',`https://maps.google.com/maps?q=${lat}, ${long}&output=embed`);
    console.log(data);
    
    let div = document.querySelector('.ip-info');
    div.innerHTML = `<span>Lat: ${lat}</span>
    <span>City: ${data.city}</span>
    <span>Organization: ${data.org}</span>
    <span>Long: ${long}</span>
    <span>Region: ${data.region}</span>
    <span>Hostname: ${data.hostname || 'N/A'}</span>`

    displayData(data);

}


function displayData(data) {
    var pincodeCount=0;
    fetch(`https://api.postalpincode.in/pincode/${data.postal}`)
    .then((response) => response.json())
    .then((timeData) => {
        console.log(timeData);
        const postOffices = timeData[0].PostOffice;
        
      postOffices.forEach((element) => {
        pincodeCount++;
      });

    //display TimeZone
    const currentTime = new Date().toLocaleString('en-US', { timeZone: data.timezone });
    let current_info = document.querySelector('.current-info');
    current_info.innerHTML = `<span>Time Zone: ${data.timezone}</span>
    <span>Date and Time: ${currentTime}</span>
    <span>Pincode: ${data.postal}</span>
    <span>Message:${timeData[0].Message}</span>`;

//Display Post offices
    let postal_container = document.querySelector('.postal-container');
    postOffices.forEach((postOffice) => {
        //create Div
        let div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<span>Name: ${postOffice.Name}</span>
        <span>Banch Type: ${postOffice.BranchType}</span>
        <span>Delivery Status: ${postOffice.DeliveryStatus}</span>
        <span>District: ${postOffice.District}</span>
        <span>Division: ${postOffice.Division}</span>`;
        postal_container.appendChild(div);
    });
        
});
};

function filterPostOffices() {
    const searchBox = document.getElementById('searchBox');
    const filter = searchBox.value.toUpperCase();
    const postOfficeList = document.querySelector('.postal-container');
    const postOffices = postOfficeList.getElementsByClassName('item');

    for (let i = 0; i < postOffices.length; i++) {
        const postOffice = postOffices[i];
        const text = postOffice.textContent.toUpperCase();
        if (text.indexOf(filter) > -1) {
            postOffice.style.display = '';
        } else {
            postOffice.style.display = 'none';
        }
    }
}

document.getElementById('searchBox').addEventListener('keyup', filterPostOffices);