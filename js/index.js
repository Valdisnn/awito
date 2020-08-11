document.addEventListener('DOMContentLoaded', () => {

    'use strict';

    const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

    let counter = dataBase.length;

    const modalAdd = document.querySelector('.modal__add'),
        addAd = document.querySelector('.add__ad'),
        modalBtnSubmit = document.querySelector('.modal__btn-submit'),
        modalSubmit = document.querySelector('.modal__submit'),
        catalog = document.querySelector('.catalog'),
        modalItem = document.querySelector('.modal__item'),
        modalBtnWarning = document.querySelector('.modal__btn-warning'),
        modalFileInput = document.querySelector('.modal__file-input'),
        modalFileBtn = document.querySelector('.modal__file-btn'),
        modalImageAdd = document.querySelector('.modal__image-add'),
        modalImageItem = document.querySelector('.modal__image-item'),
        modalHeaderItem = document.querySelector('.modal__header-item'),
        modalStatusItem = document.querySelector('.modal__status-item'),
        modalDescriptionItem = document.querySelector('.modal__description-item'),
        modalCostItem = document.querySelector('.modal__cost-item'),
        searchInput = document.querySelector('.search__input'),
        menuContainer = document.querySelector('.menu__container'),
        logo = document.querySelector('.logo'),
        clearDB = document.querySelector('.clear__local-storage');

    const textFileBtn = modalFileBtn.textContent;
    const srcModalImage = modalImageAdd.src;

    const elementsModalSubmit = [...modalSubmit.elements]
        .filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');

    const infoPhoto = {};

    const saveDataBase = () => {
        localStorage.setItem('awito', JSON.stringify(dataBase));
    };

    const check = () => {
        const validForm = elementsModalSubmit.every(elem => elem.value);
        modalBtnSubmit.disabled = !validForm;
        modalBtnWarning.style.display = validForm ? 'none' : '';
    };

    const closeModal = (event) => {
        const target = event.target;

        if (target.closest('.modal__close') || target.classList.contains('modal') || event.code === 'Escape') {
            modalAdd.classList.add('hide');
            modalItem.classList.add('hide');
            document.removeEventListener('keydown', closeModal);
            modalSubmit.reset();
            modalImageAdd.src = srcModalImage;
            modalFileBtn.textContent = textFileBtn;
            check();
        }
    };

    const renderCard = (DB = dataBase) => {
        catalog.textContent = '';
        DB.forEach((item) => {
            catalog.insertAdjacentHTML('beforeend', `
            <li class="card" data-id="${item.id}">
            <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="Карточка">
                <div class="card__description">
                    <h3 class="card__header">${item.nameItem}</h3>
                    <div class="card__price">${item.costItem} ₽</div>
                </div>
            </li>
            `);
        });
    };

    searchInput.addEventListener('input', () => {
        const valueSearch = searchInput.value.trim().toLowerCase();

        if (valueSearch.length >= 2) {
            const result = dataBase.filter(item => item.nameItem.toLowerCase().includes(valueSearch) ||
                item.descriptionItem.toLowerCase().includes(valueSearch));
            renderCard(result);
        }
        if (valueSearch.length === 0) {
            renderCard();
        }
    });

    modalFileInput.addEventListener('change', (event) => {
        const target = event.target;

        const reader = new FileReader();
        const file = target.files[0];

        infoPhoto.filename = file.name;
        infoPhoto.size = file.size;

        reader.readAsBinaryString(file);
        reader.addEventListener('load', (event) => {

            if (infoPhoto.size < 2000000) {
                modalFileBtn.textContent = infoPhoto.filename;
                infoPhoto.base64 = btoa(event.target.result);
                modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
            } else {
                modalFileBtn.textContent = 'Файл > 2 мб';
                modalFileInput.value = '';
                check();
            }

            const photoNameLength = () => {

                if (modalFileBtn.textContent.length > 20) {
                    modalFileBtn.textContent = modalFileBtn.textContent.substring(0, 19) + '.png';
                }
                return modalFileBtn.textContent;
            };

            photoNameLength();
        });
    });

    modalSubmit.addEventListener('input', check);

    modalSubmit.addEventListener('submit', (event) => {
        event.preventDefault();
        const itemObj = {};

        for (const elem of elementsModalSubmit) {
            itemObj[elem.name] = elem.value;
        }
        itemObj.id = counter++;
        itemObj.image = infoPhoto.base64;
        dataBase.push(itemObj);
        closeModal({
            target: modalAdd
        });
        saveDataBase();
        renderCard();
    });

    addAd.addEventListener('click', () => {
        modalAdd.classList.remove('hide');
        modalBtnSubmit.disabled = true;
        document.addEventListener('keydown', closeModal);
    });

    catalog.addEventListener('click', (event) => {
        const target = event.target;
        const card = target.closest('.card');

        if (card) {
            const item = dataBase.find(obj => obj.id === +card.dataset.id);
            modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
            modalHeaderItem.textContent = item.nameItem;
            modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У';
            modalDescriptionItem.textContent = item.descriptionItem;
            modalCostItem.textContent = item.costItem + ' ₽';
            modalItem.classList.remove('hide');
            document.addEventListener('keydown', closeModal);
        }
    });

    menuContainer.addEventListener('click', (event) => {
        const target = event.target;

        if (target.tagName === 'A') {
            const result = dataBase.filter((item) => item.category === target.dataset.category);
            renderCard(result);
        }
    });

    modalAdd.addEventListener('click', closeModal);
    modalItem.addEventListener('click', closeModal);

    logo.addEventListener('click', (event) => {
        event.preventDefault();
        renderCard();
    });

    clearDB.addEventListener('dblclick', (event) => {
        event.preventDefault();
        localStorage.removeItem('awito', JSON.stringify(dataBase));
        location.reload();
    });

    searchInput.addEventListener('input', (event) => {
        event.preventDefault();
        searchInput.style = 'border: 2px solid #BF3F4A;';

        if (searchInput.value === '') {
            searchInput.style = 'border: 2px solid #009cf0;';
        }
    });

    renderCard();
});