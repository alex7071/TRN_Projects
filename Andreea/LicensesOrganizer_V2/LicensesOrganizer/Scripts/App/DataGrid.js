var gridDataUrl = '/TestData/GetPaginatedData';
var currentPageIndex = 1;
var currentItemsPerPage = null;
var currentTotalPages = null;
var pageNumber = null;
//data loading methods

function getGridData(currentPage, pageSize, indexFieldName, sortOrder, pageNumber) {
    $.get(gridDataUrl,
        {
            page: currentPage,
            resultsPerPage: pageSize,
            index: indexFieldName,
            order: sortOrder,
            totalPages: pageNumber
        },
        function (data) {
            currentPageIndex = data.page;  
            pageNumber = data.totalPages;           
            onGetGridDataSuccess(data);
            generateGridPager(data);
        });
};

function refreshGrid() {
    getGridData(currentPageIndex, currentItemsPerPage, pageNumber);
};

function onGetGridDataSuccess(response) {

    var dataGrid = $('#paginator');
    var dataTablecontent = $('#paginator tbody');
    var tableRowTemplate = "\
        <tr>\
            <tr class=\"{{rowClassName}}\">\
                <td>{{id}}</td>\
                <td>{{first_name}}</td>\
                <td>{{last_name}}</td>\
                <td>{{email}}</td>\
                <td>{{gender}}</td>\
            </tr>\
        </tr>";

    dataTablecontent.empty();

    var tableBodyHtml = '';
    for (var i = 0; i < response.data.length; i++) {
        var rowData = response.data[i];
        rowData.rowClassName = (i % 2 == 0 ? 'even' : 'odd');
        var rowHTML = Mustache.render(tableRowTemplate, rowData);
        tableBodyHtml += rowHTML;
    }
    dataTablecontent.append(tableBodyHtml);
};

//paginator methods
function generateGridPager(response) {
    var pageNumbersContainer = $('#current-page span');
    var pageNumberTemplate = "<a class={{className}} onclick=\"getGridData{{pageIndex}}\">{{pageIndex}}</a>";


    var previousButton = $('#previous-page');
    if (currentPageIndex === 1) {
        // Here add the disabled class
        previousButton.addClass('disabled');
    }
    else {
        // Here remove the disabled class
        previousButton.removeClass('disabled');
    }

    var nextButton = $('#next-page'); 
    if (currentPageIndex === currentTotalPages) {
        nextButton.addClass('disabled');
    }
    else {
        nextButton.removeClass('disabled');
    }
};

function initializeGridPager() {
    var firstPage = $('#first-page');
    firstPage.click(function () {
        currentPageIndex = 1;
        refreshGrid();
    });

    var lastPage = $('#last-page');
    lastPage.click(function () {
        //currentPageIndex = currentTotalPages;
        currentPageIndex = 1000 / currentItemsPerPage;
        currentTotalPages = currentPageIndex;
        refreshGrid(currentTotalPages);
    });

    var previousButton = $('#previous-page');
    previousButton.click(function () {
        // Here check if we're already on the first page. If so, don't do anything. Otherwise, do the regular.
        if (currentPageIndex === 1) {
            return
        }
        else {
            currentPageIndex = (currentPageIndex - 1);
            refreshGrid();
        }          
       
    });
    var nextButton = $('#next-page'); 
    nextButton.click(function () {
        if (currentPageIndex === currentTotalPages) {
            return
        }
        else {
            currentPageIndex = (currentPageIndex + 1);
            refreshGrid();
        }          
    });  
};

//show elepents per page methods
function initializeItemPerPageDropdown() {
    $('#items-select').change(function () {
        currentPageIndex = 1;
        currentItemsPerPage = getSelectedItemsPerPage();
        refreshGrid();
    }); 
};

function getSelectedItemsPerPage() {
    return $("#items-select option:selected").val();
};

$(document).ready(function () {
    currentItemsPerPage = getSelectedItemsPerPage();
    initializeItemPerPageDropdown();
    initializeGridPager();
    getGridData();
});
