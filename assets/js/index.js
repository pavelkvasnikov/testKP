$(document).ready(function() {
    var orderState = [];
    // data for server
    var Recount = function() {
         // function to recount changes
         orderState = [];
         var subSummaries = 0;
         $('[data-tr=row]').each(function(i, item) {
             if (item.dataset.type==='gadget') {
                 subSummaries += parseInt(item.childNodes[1].dataset.value);
             }
             if (item.dataset.type==='fee') {
                 subSummaries += parseInt(item.childNodes[1].dataset.value);
             }
             // fee and gadget are the same
             if (item.dataset.type==='fxd') {
                 subSummaries -= parseInt(item.childNodes[1].dataset.value);
             }
             if (item.dataset.type==='per') {
                 subSummaries *= ((100 - parseInt(item.childNodes[1].dataset.value))/100);
                 // deal with percent
             }
             orderState.push({type: item.dataset.type, value: item.childNodes[1].dataset.value});
         });
        orderState.push({type: 'summary', value: subSummaries});
        $('td.summary').text(subSummaries);
    };
    var sortableParent = $('tbody');
    sortableParent.sortable(
        {
            cancel: ".nosort",
            stop: Recount
        }
    );
    // lib for drag'n'drop

    $('#add').click(function(){
        var type = $('#linetype').val();
        var descr = $('#descr').val();
        var value = $('#linevalue').val();
        $(CreateRow(type, descr, value)).insertBefore('.last');
        Recount();
    });

    $('#send').click(function(){
        console.log(orderState);
        $.ajax({
            method: 'POST',
            url: 'saveinvoice',
            data: JSON.stringify(orderState)
        })
    });

    var CreateRow = function(type, descr, price){
        var elem = document.createElement('tr');
        elem.dataset.type = type;
        elem.dataset.tr = 'row';
        elem.appendChild(Td(descr));
        elem.appendChild(Td(price));
        elem.appendChild(Td('').appendChild(DeleteButton(elem)));
        return elem;
    };

    var DeleteButton = function(target) {
        var elem = document.createElement('button');
        elem.textContent = 'Delete';
        elem.onclick = function() { target.remove(); Recount(); };
        return elem;
    };

    var Td = function(text) {
        var elem = document.createElement('td');
        elem.dataset.value = text;
        elem.textContent = text;
        return elem;
    };

});