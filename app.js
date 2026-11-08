let selectedImage = null;

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}

document
.querySelector(".live-btn")
.addEventListener("click", () => {

    window.open("projector.html", "projector");

});

/* ==========================
   TABS
========================== */

const slidesTab =
document.getElementById("slidesTab");

const bibleTab =
document.getElementById("bibleTab");

const slidesPanel =
document.getElementById("slidesPanel");

const biblePanel =
document.getElementById("biblePanel");

slidesTab.addEventListener("click", () => {

    slidesTab.classList.add("active");
    bibleTab.classList.remove("active");

    slidesPanel.style.display = "block";
    biblePanel.style.display = "none";

});

bibleTab.addEventListener("click", () => {

    bibleTab.classList.add("active");
    slidesTab.classList.remove("active");

    biblePanel.style.display = "block";
    slidesPanel.style.display = "none";

});


/* ==========================
   SLIDES
========================== */

const slideGrid =
document.querySelector(".slide-grid");

const preview =
document.querySelector(".preview");

const input =
document.createElement("input");

input.type = "file";
input.accept = "image/*";
input.multiple = true;

document
.querySelector(".add-photo")
.addEventListener("click", () => {

    input.click();

});

input.addEventListener("change", (event) => {

    const files = event.target.files;

    for (let file of files) {

        const reader = new FileReader();

        reader.onload = function(e) {

            const card =
            document.createElement("div");

            card.className = "slide";

            card.style.backgroundImage =
            `url('${e.target.result}')`;

            card.style.backgroundSize = "cover";

            card.style.backgroundPosition =
            "center";

            card.addEventListener("click", () => {

                selectedImage =
                e.target.result;

                preview.innerHTML = "";

                const img =
                document.createElement("img");

                img.src =
                selectedImage;

                img.style.maxWidth =
                "100%";

                img.style.maxHeight =
                "100%";

                preview.appendChild(img);

                localStorage.setItem(
                    "liveImage",
                    selectedImage
                );

                localStorage.removeItem(
                    "liveBible"
                );

            });

            slideGrid.insertBefore(
                card,
                document.querySelector(".add-photo")
            );

        };

        reader.readAsDataURL(file);

    }

});


/* ==========================
   BIBLE
========================== */

const bookSelect =
document.getElementById("bookSelect");

fetch("RV1960_Zefania.xml")
.then(response => response.text())
.then(xmlText => {

    const parser =
    new DOMParser();

    const xml =
    parser.parseFromString(
        xmlText,
        "text/xml"
    );

    const books =
    xml.querySelectorAll(
        "BIBLEBOOK"
    );

    window.bibleXml = xml;

    bookSelect.innerHTML = "";

    books.forEach(book => {

        const option =
        document.createElement(
            "option"
        );

        option.value =
        book.getAttribute(
            "bnumber"
        );

        option.textContent =
        book.getAttribute(
            "bname"
        );

        bookSelect.appendChild(
            option
        );

    });

    bookSelect.dispatchEvent(
    new Event("change")
    );

});

const chapterSelect =
document.getElementById(
    "chapterSelect"
);

const verseSelect =
document.getElementById(
    "verseSelect"
);

bookSelect.addEventListener(
    "change",
    () => {

    if(!window.bibleXml)
        return;

    const bookNumber =
    bookSelect.value;

    const selectedBook =
    window.bibleXml.querySelector(
        `BIBLEBOOK[bnumber="${bookNumber}"]`
    );

    if(!selectedBook)
        return;

    const chapters =
    selectedBook.querySelectorAll(
        "CHAPTER"
    );

    chapterSelect.innerHTML =
    "";

    chapters.forEach(
        chapter => {

        const option =
        document.createElement(
            "option"
        );

        option.value =
        chapter.getAttribute(
            "cnumber"
        );

        option.textContent =
        chapter.getAttribute(
            "cnumber"
        );

        chapterSelect.appendChild(
            option
        );

    });

    chapterSelect.dispatchEvent(
    new Event("change")
    );

});

chapterSelect.addEventListener(
    "change",
    () => {

    if(!window.bibleXml)
        return;

    const bookNumber =
    bookSelect.value;

    const chapterNumber =
    chapterSelect.value;

    const selectedBook =
    window.bibleXml.querySelector(
        `BIBLEBOOK[bnumber="${bookNumber}"]`
    );

    if(!selectedBook)
        return;

    const selectedChapter =
    selectedBook.querySelector(
        `CHAPTER[cnumber="${chapterNumber}"]`
    );

    if(!selectedChapter)
        return;

    const verses =
    selectedChapter.querySelectorAll(
        "VERS"
    );

    verseSelect.innerHTML =
    "";

    verses.forEach(
        verse => {

        const option =
        document.createElement(
            "option"
        );

        option.value =
        verse.getAttribute(
            "vnumber"
        );

        option.textContent =
        verse.getAttribute(
            "vnumber"
        );

        verseSelect.appendChild(
            option
        );

    });

});

verseSelect.addEventListener(
    "change",
    () => {

    if(!window.bibleXml)
        return;

    const bookNumber =
    bookSelect.value;

    const chapterNumber =
    chapterSelect.value;

    const verseNumber =
    verseSelect.value;

    const selectedBook =
    window.bibleXml.querySelector(
        `BIBLEBOOK[bnumber="${bookNumber}"]`
    );

    if(!selectedBook)
        return;

    const selectedChapter =
    selectedBook.querySelector(
        `CHAPTER[cnumber="${chapterNumber}"]`
    );

    if(!selectedChapter)
        return;

    const selectedVerse =
    selectedChapter.querySelector(
        `VERS[vnumber="${verseNumber}"]`
    );

    if(!selectedVerse)
        return;

    const bookName =
    bookSelect.options[
        bookSelect.selectedIndex
    ].text;

    preview.innerHTML = `

        <div style="
            padding:30px;
            text-align:center;
            color:white;
        ">

            <h2>
                ${bookName}
                ${chapterNumber}:${verseNumber}
            </h2>

            <p style="
                font-size:24px;
                line-height:1.6;
            ">
                ${selectedVerse.textContent}
            </p>

            <small>
                Reina Valera 1960
            </small>

        </div>

    `;

});    

    const projectBibleBtn =
document.getElementById(
    "projectBibleBtn"
);

projectBibleBtn.addEventListener(
    "click",
    () => {

    if(!window.bibleXml)
        return;

    const bookName =
    bookSelect.options[
        bookSelect.selectedIndex
    ].text;

    const chapterNumber =
    chapterSelect.value;

    const verseNumber =
    verseSelect.value;

    const selectedBook =
    window.bibleXml.querySelector(
        `BIBLEBOOK[bnumber="${bookSelect.value}"]`
    );

    const selectedChapter =
    selectedBook.querySelector(
        `CHAPTER[cnumber="${chapterNumber}"]`
    );

    const selectedVerse =
    selectedChapter.querySelector(
        `VERS[vnumber="${verseNumber}"]`
    );

    localStorage.setItem(
        "liveBible",
        JSON.stringify({

            book: bookName,

            chapter: chapterNumber,

            verse: verseNumber,

            text: selectedVerse.textContent

        })
    );

    localStorage.removeItem(
        "liveImage"
    );

});

const bibleBackgroundBtn =
document.getElementById(
    "bibleBackgroundBtn"
);

const bibleBackgroundInput =
document.createElement("input");

bibleBackgroundInput.type =
"file";

bibleBackgroundInput.accept =
"image/*";

bibleBackgroundBtn.addEventListener(
    "click",
    () => {

    bibleBackgroundInput.click();

});

bibleBackgroundInput.addEventListener(
    "change",
    (event) => {

    const file =
    event.target.files[0];

    if(!file)
        return;

    const reader =
    new FileReader();

    reader.onload =
    function(e){

        localStorage.setItem(
            "bibleBackground",
            e.target.result
        );

        const preview =
        document.getElementById(
            "bibleBackgroundPreview"
        );

        preview.style.backgroundImage =
        `url('${e.target.result}')`;

        preview.textContent = "";

        alert(
            "Fondo Biblia guardado"
        );

    };

    reader.readAsDataURL(
        file
    );

});