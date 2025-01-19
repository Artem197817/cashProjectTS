import {Operation} from "../types/operations.type";

export class CardCreate {


    static cardCreateIncomesOrExpenses(element: string): HTMLElement {

        const cardElement: HTMLElement = document.createElement('div');
        cardElement.classList.add('card');

        const cardBodyElement: HTMLElement = document.createElement('div');
        cardBodyElement.classList.add('card-body');

        const cardTitleElement: HTMLElement = document.createElement('h2');
        cardTitleElement.classList.add('card-title');
        cardTitleElement.classList.add('mb-3');
        cardTitleElement.innerText = element;

        const buttonsElement: HTMLElement = document.createElement('div');
        buttonsElement.classList.add('buttons');

        const buttonEditElement: HTMLElement = document.createElement('button');
        buttonEditElement.classList.add('edit');
        buttonEditElement.classList.add('btn');
        buttonEditElement.classList.add('btn-primary');
        buttonEditElement.style.marginRight = '10px'
        buttonEditElement.innerText = 'Редактировать';

        const buttonDeleteElement: HTMLElement = document.createElement('button');
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

   public static createRowTable(operation: Operation): HTMLElement {
        const trElement: HTMLElement = document.createElement('tr');

        const thNumberElement: HTMLElement = document.createElement('th');
        thNumberElement.classList.add('number');
        thNumberElement.setAttribute('value', operation.id.toString());
        thNumberElement.setAttribute('scope', 'row');
        thNumberElement.innerText = operation.id.toString();

        trElement.appendChild(thNumberElement);

        const tdTypeElement: HTMLElement = document.createElement('td');
        const tdAmountElement: HTMLElement = document.createElement('td');
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

        const tdCategoryElement: HTMLElement = document.createElement('td');
        tdCategoryElement.classList.add('category');
        tdCategoryElement.innerText = operation.category;

        trElement.appendChild(tdCategoryElement);

        tdAmountElement.innerText = operation.amount + ' $';

        trElement.appendChild(tdAmountElement);

        const tdDateElement: HTMLElement = document.createElement('td');
        tdDateElement.innerText = operation.date;

        trElement.appendChild(tdDateElement);

        const tdCommentElement: HTMLElement = document.createElement('td');
        tdCommentElement.classList.add('comment');
        tdCommentElement.innerText = operation.comment;

        trElement.appendChild(tdCommentElement);

        const tdIconElement: HTMLElement = document.createElement('td');
        tdIconElement.classList.add('icon-table');

        const unionIcon: HTMLImageElement = document.createElement('img');
        unionIcon.src = "../../images/union.png";
        unionIcon.alt = "union";
        unionIcon.classList.add("union");

        const pencilIcon: HTMLImageElement = document.createElement('img');
        pencilIcon.src = "../../images/pencil.png";
        pencilIcon.alt = "pencil";
        pencilIcon.classList.add("pencil");

        tdIconElement.appendChild(unionIcon);
        tdIconElement.appendChild(pencilIcon);

        trElement.appendChild(tdIconElement);

        return trElement;
    }

}

