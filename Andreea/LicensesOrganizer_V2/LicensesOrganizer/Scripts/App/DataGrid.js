var gridDataUrl = '/TestData/GetPaginatedData';
var currentPageIndex = 1;
var currentItemsPerPage = null;
var currentTotalPages = null;
var pageNumber = null;
var sortByFieldName = null;
var gridSortOrder = 'asc';

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
            sortByFieldName = data.order;
            onGetGridDataSuccess(data);
            generateGridPager(data);
        });
};

function refreshGrid() {
    getGridData(currentPageIndex, currentItemsPerPage, sortByFieldName, gridSortOrder, pageNumber);
};

function onGetGridDataSuccess(response) {
    var dataTablecontent = $('#paginator tbody');
    var tableRowTemplate = "\
        <tr>\
            <tr class=\"{{rowClassName}}\">\
                <td>{{id}}</td>\
                <td>{{first_name}}</td>\
                <td>{{last_name}}</td>\
                <td>{{email}}</td>\
                <td>{{gender}}</td>\
                <td>{{ip_address}}</td>\
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
    //pagination 1-5...
    var pageNumbersContainer = $('#current-page span');
    var pageNumberTemplate = '<a class={{className}} data-pageindex="{{pageIndex}}">{{pageIndex}}</a>';
    var pagerStartIndex = 0;
    if (currentPageIndex - 2 <= 0) {
        pagerStartIndex = 1;
    } else {
        pagerStartIndex = currentPageIndex - 2;
    }

    var pagerEntries = '';
    for (var i = pagerStartIndex; i < pagerStartIndex + 5 && i < response.totalPages; i++) {
        var pagerEntry = Mustache.render(pageNumberTemplate, { pageIndex: i, className: 'test' });
        pagerEntries += pagerEntry;
    }

    pageNumbersContainer.empty();
    pageNumbersContainer.append(pagerEntries);

    pageNumbersContainer.children('a').click(function () {
        currentPageIndex = $(this).data('pageindex');
        refreshGrid();
    }); 
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


//sort table
function initializeGridSorting() {
    var rowHeaders = $('#paginator thead th');
    var defaultSortColumn = document.querySelectorAll('[data-fieldname="id"]');
    $(defaultSortColumn).addClass('asc');
    rowHeaders.click(function () {
        sortByFieldName = $(this).data('fieldname');
        if (sortByFieldName === "id") {
            gridSortOrder = (gridSortOrder === 'asc' ? 'desc' : 'asc');
            rowHeaders.removeClass('desc asc');
            $(this).addClass(gridSortOrder);

            refreshGrid();
            var defaultSortColumn = document.querySelectorAll('[data-fieldname="id"]');
            $(defaultSortColumn).addClass('asc');
        }
        else {
            gridSortOrder = (gridSortOrder === 'asc' ? 'desc' : 'asc');
            rowHeaders.removeClass('desc asc');
            $(this).addClass(gridSortOrder);

            refreshGrid();
            var defaultSortColumn = document.querySelectorAll('[data-fieldname="id"]');
            $(defaultSortColumn).removeClass('asc desc');
        }
        
    });
};

$(document).ready(function () {
    currentItemsPerPage = getSelectedItemsPerPage();
    initializeItemPerPageDropdown();
    initializeGridPager();
    initializeGridSorting();

    getGridData();
});
