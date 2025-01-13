export class CardCreate {


    static cardCreateIncomesOrExpenses(element) {

        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        const cardBodyElement = document.createElement('div');
        cardBodyElement.classList.add('card-body');

        const cardTitleElement = document.createElement('h2');
        cardTitleElement.classList.add('card-title');
        cardTitleElement.classList.add('mb-3');
        cardTitleElement.innerText = element;

        const buttonsElement = document.createElement('div');
        buttonsElement.classList.add('buttons');

        const buttonEditElement = document.createElement('button');
        buttonEditElement.classList.add('edit');
        buttonEditElement.classList.add('btn');
        buttonEditElement.classList.add('btn-primary');
        buttonEditElement.style.marginRight = '10px'
        buttonEditElement.innerText = 'Редактировать';

        const buttonDeleteElement = document.createElement('button');
        buttonDeleteElement.classList.add('delete');
        buttonDeleteElement.classList.add('btn');
        buttonDeleteElement.classList.add('btn-danger');
        buttonDeleteElement.innerText = 'Удалить';

        buttonsElement.appendChild(buttonEditElement);
        buttonsElement.appendChild(buttonDeleteElement);

        cardBodyElement.appendChild(cardTitleElement);
        cardBodyElement.appendChild(buttonsElement);
        cardElement.appendChild(cardBodyElement);
        return cardElement;
    }

    static createRowTable(operation) {
        const trElement = document.createElement('tr');

        const thNumberElement = document.createElement('th');
        thNumberElement.classList.add('number');
        thNumberElement.setAttribute('value', operation.id);
        thNumberElement.setAttribute('scope', 'row');
        thNumberElement.innerText = operation.id;

        trElement.appendChild(thNumberElement);

        const tdTypeElement = document.createElement('td');
        const tdAmountElement = document.createElement('td');
        tdTypeElement.classList.add('type');
        if (operation.type === 'income') {
            tdTypeElement.innerText = 'доход';
            tdTypeElement.classList.add('text-success');
            tdAmountElement.classList.add('text-success');
        } else {
            tdTypeElement.innerText = 'расход';
            tdTypeElement.classList.add('text-danger');
            tdAmountElement.classList.add('text-danger');
        }
        trElement.appendChild(tdTypeElement);

        const tdCategoryElement = document.createElement('td');
        tdCategoryElement.classList.add('category');
        tdCategoryElement.innerText = operation.category;

        trElement.appendChild(tdCategoryElement);

        tdAmountElement.innerText = operation.amount + ' $';

        trElement.appendChild(tdAmountElement);

        const tdDateElement = document.createElement('td');
        tdDateElement.innerText = operation.date;

        trElement.appendChild(tdDateElement);

        const tdCommentElement = document.createElement('td');
        tdCommentElement.classList.add('comment');
        tdCommentElement.innerText = operation.comment;

        trElement.appendChild(tdCommentElement);

        const tdIconElement = document.createElement('td');
        tdIconElement.classList.add('icon-table');

        const unionIcon = document.createElement('img');
        unionIcon.src = "../../images/union.png";
        unionIcon.alt = "union";
        unionIcon.classList.add("union");

        const pencilIcon = document.createElement('img');
        pencilIcon.src = "../../images/pencil.png";
        pencilIcon.alt = "pencil";
        pencilIcon.classList.add("pencil");

        tdIconElement.appendChild(unionIcon);
        tdIconElement.appendChild(pencilIcon);

        trElement.appendChild(tdIconElement);

        return trElement;
    }

}

