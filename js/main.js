window.addEventListener('load', function(e) {
    let store = []

    //submitting a transaction event
    document.querySelector(".frm-transactions").addEventListener('submit', function(e){
        e.preventDefault()
        
        const typeMenu = document.querySelectorAll('.frm-control')[1]
        const dataObject = {
            id: uuidv4().substring(0,8),
            transactionAmount: Number(e.currentTarget.querySelectorAll('.frm-control')[2].value),
            type: typeMenu.options[typeMenu.selectedIndex].value,
            description: e.currentTarget.querySelectorAll('.frm-control')[0].value
        }

        formatTransaction(dataObject);
        updateTotal();
    })

    // removing transaction event
    document.querySelector('.transactions').addEventListener('click', function(e){
            const clicked = e.target;
            if (clicked.classList.contains('delete')){
                if (window.confirm('Are you sure you want to delete this transaction? :(')) {
                    const transactionRow = clicked.closest('tr');
                    transactionRow.remove();
                    const key = transactionRow.dataset.key;
                    store = store.filter(({id}) => id != key)
                    updateTotal();
                }
            }
    })

    //transaction template
    function formatTransaction(transaction){
        const display = document.getElementsByTagName('tbody')[0];
        const template = `
            <table>
                <tr class="${transaction.type}" data-key="${transaction.id}">
                    <td>${transaction.description}</td>
                    <td>${transaction.type}</td>
                    <td class="amount">$${transaction.transactionAmount.toFixed(2)}</td>
                    <td class="tools">
                        <i class="delete fa fa-trash-o"></i>
                    </td>
                </tr>
            </table>`;

        const elem = document.createRange().createContextualFragment(template).children[0];

        //error handling
        if (transaction.type === '' || transaction.transactionAmount === 0) {
            document.querySelector('.error').textContent = 'Please select a payment type and input the transaction amount'

            document.querySelectorAll('.frm-control')[1].addEventListener('focus', function(e) {
                document.querySelector('.error').textContent = ''
            })
            document.querySelectorAll('.frm-control')[2].addEventListener('focus', function(e){
                document.querySelector('.error').textContent = ''
            })
        }
        else {
        store.push(transaction)
        display.appendChild(elem.querySelector('tr'))
        }

    } 

    //calculating total function
    const totalCreditSpan = document.querySelector(".total.credits")
    const totalDebitSpan = document.querySelector(".total.debits")

    function updateTotal() {
        let totalCredits = 0;
        let totalDebits = 0;
        store.forEach(({type,transactionAmount}) => {
            if (type === 'credit') {totalCredits += transactionAmount}
            if (type === 'debit') {totalDebits  += transactionAmount}
        }) 
        totalCreditSpan.textContent = '$' + totalCredits.toFixed(2)
        totalDebitSpan.textContent = '$' + totalDebits.toFixed(2)

        resetForm()
    }

    //reset form after sumbission
    function resetForm(){
        const typeMenu = document.querySelectorAll('.frm-control')[1];
        document.querySelector(".frm-transactions").querySelectorAll('.frm-control')[0].value = ''
        document.querySelectorAll('.frm-control')[2].value = 0;
        typeMenu.options.selectedIndex = 0;

    }

    //2min inactivity page refresh
    function inactivity() {
        var t;
        window.onload = resetTime;
        window.onmousemove = resetTime;
        window.onmousedown = resetTime;  
        window.ontouchstart = resetTime;
        window.onclick = resetTime;
        window.onkeydown = resetTime;   
        window.addEventListener('scroll', resetTime, true); 
    
        function alertRefresh() {
            if(alert('The page has expired due to inactivity. Goodbyeee')){}
            else {window.location.reload()}
        }
    
        function resetTime() {
            clearTimeout(t);
            t = setTimeout(alertRefresh, 120*1000);
        }
    }
    inactivity();
})