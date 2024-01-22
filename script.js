let repo = [];
let repoDescription = [];
let repoLanguage = [];
let laguages = [];

let repocount = 0;

let urlforUserdetail = `https://api.github.com/users/`;

let indx = 0;


function getUsername() {

    let topcontainer = document.querySelector('.topcontainer');
    topcontainer.classList.remove('topcontainer');

    let mainbox = document.querySelector('.main');
    mainbox.classList.remove('main');

    let username = document.querySelector('.unsername').value;
    if (username == '') {
        alert("Please Enter Valid Username");
        window.location.href = "index.html";
    }

    let origianl = username.split(' ').join(''); // for removing spaces
    username = origianl;
    urlforUserdetail = `https://api.github.com/users/${origianl}`;


    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                if(response.status==403){
                alert("API is Not Responding Currently Please Try Again After Some Time");
                // window.location.href = "index.html";
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

       
            return response.json();
        })
        .then(data => {

            let name = data['name']
            let profileImg = data['avatar_url'];
            let bio = data['bio']
            let location = data['location']

            if (bio == null) {
                bio = "Not Mentioned";
            }
            if (location == null) {
                location = "Not Mentioned";
            }
            let span = document.createElement('span');
            span.innerText = "Bio - ";
            document.getElementById('userimg').src = data['avatar_url']
            document.querySelector('#nameofuser').innerText = name + ` ( ${username} )`;
            let a = document.querySelector('.Bio');
            a.innerText = bio;
            let span2 = document.createElement('span');
            span2.innerText = "Bio - ";
            a.prepend(span2)
            span.innerText = "Location - ";
            document.querySelector('#location').innerText = location;
            document.querySelector('#location').prepend(span)
            let span3 =document.createElement('span');
            span3.innerText="Profile Link - ";
            document.querySelector('#userUrl-ancer').href=`https://github.com/${username}`;
            document.querySelector('#userUrl').prepend(span3);
            document.querySelector('#userUrl-ancer').innerText=`https://github.com/${username}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log(data[0]["description"])
            console.log(data)
            if (data.length == 0) {
                document.querySelector('#again-src-box').classList.add('again-sr');
                let el = document.getElementById('again-search');
                el.style.marginLeft = '0';
                let el2 = document.getElementById('user-profile-container');
                el2.style.justifyContent = 'space-evenly';
                let p = document.createElement('p');
                p.innerText = "No Repo Found";
                p.className = 'no-repo-para'
                document.querySelector('.list-container').appendChild(p);
                document.querySelector('.list-container').style.gridTemplateColumns = '1fr'
                return;
            }
            for (let i = 0; i < data.length; i++) {
                repo.push(data[i]['name']);
                repocount++;
                repoDescription.push(data[i]['description']);
            }

        })
        .then(() => {
            for (let indx = 0; indx < repo.length; indx++) {
                fetch(`https://api.github.com/repos/${username}/${repo[indx]}/languages`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        repoLanguage.push(data);
                    })
                    .then(data => {
                        for (let i = indx; i < repoLanguage.length; i++) {
                            let str = "";

                            for (let key in repoLanguage[i]) {
                                str = str + key + " ";
                                // strarr.push(key) 
                            }
                            laguages.push(str);

                            // console.log(str);

                        }
                    })
                    .then(() => {

                        additems(repocount);

                    })
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });


}
let searchbtn = document.querySelector('#search-btn');

searchbtn.addEventListener('click', getUsername);


searchbtn.addEventListener("click", function () {

    document.getElementById("loader").classList.remove('loader-none')
    document.getElementById("loader").classList.add('loader');
    document.getElementById("content").classList.add('hidden')
    setTimeout(function () {
     
        document.getElementById("loader").style.display = "none";

        // Show the content
        var content = document.getElementById("content");
        content.classList.remove("hidden");
        content.classList.add("loaded");
    }, 1500);
});

function additems(repocount) {

    const itemsPerPage = 4; 


    function displayList(startIndex, endIndex) {
        const listContainer = document.getElementById('list-container');
        listContainer.innerHTML = '';
        let increment = 0;
        for (let i = startIndex; i < endIndex; i++) {
            if (i >= repocount) break;
            const listItem = document.createElement('div');
            console.log(startIndex, " ", endIndex)
            let h3 = document.createElement('h3');
            let p1 = document.createElement('p');

            let p2 = document.createElement('p');

            p1.className = "description-para"
            p2.className = "language-para"
            h3.className = "repo-name"
            h3.innerText = repo[startIndex + increment];
            p1.innerText = repoDescription[startIndex + increment]
            p2.innerText = laguages[startIndex + increment];
            increment++;

            listItem.appendChild(h3);
            listItem.appendChild(p1);
            listItem.appendChild(p2);

            listItem.className = 'list-item';

            indx++;
            listContainer.appendChild(listItem);
        }
    }

    function displayPagination(currentPage, totalItems) {
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(repocount / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = i;
            // console.log(i)
            if (i === currentPage) {
                link.classList.add('active');
            }

            link.addEventListener('click', function () {
                currentPage = i;
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                displayList(startIndex, endIndex);
                displayPagination(currentPage, totalItems);
            });

            paginationContainer.appendChild(link);
        }
    }

    const initialPage = 1;
    const startIndex = (initialPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    displayList(startIndex, endIndex);
    displayPagination(initialPage, repo.length);

}





