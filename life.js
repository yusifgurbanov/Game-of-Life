/*
    CSCI 2408 Computer Graphics Fall 2022 
    (c)2022 by Yusif Gurbanov 
    Submitted in partial fulfillment of the requirements of the course.
*/

/*  
-------------------Rules of Game of Life---------------------------
    Any live cell with 2 or 3 live neighbours lives on to the next generation
    Any live cell with fewer than 2 or more than 3 live neighbours dies
    Any dead cell with exactly 3 live neighbours becomes a live cell
*/

/*
----------------------------References--------------------------------
https://stackoverflow.com/questions/14643617/create-table-using-javascript
https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file 
https://stackoverflow.com/questions/34944099/how-to-import-a-json-file-in-ecmascript-6 

*/

var canvas;
var context;
window.onload = init;

var grid=new Array(columns);
var next_grid=new Array(columns) // next_grid will be used to save the current seed

function init() {
    // Get reference to the 2D context of the canvas
    canvas = document.getElementById("gl-canvas");
    context = canvas.getContext("2d");

    createTable();
    
    // initialize grid
    for(var i=0; i<columns; i++){
        
        grid[i]=new Array(rows);
        next_grid[i]=new Array(rows);
    }// end for

    // reset the grid
    for(var i=0; i<columns;i++){
        for(var j=0; j<rows; j++){
            grid[i][j]=0;
            next_grid[i][j]=0;
        }// end for j
    }// end for i

    controlButtons();

}// end init

var playing=false; //determines whether the player plays the game or not at the moment

var columns=50;
var rows=50;

function cellClick(){
    var d=this.id.split('-'); // (i+'-'+j)
    var column=d[0]; // i
    var row=d[1]; // j

    if(this.getAttribute('class').indexOf('live')==1){
        this.setAttribute('class', 'dead');
        grid[column][row]=0; // where our cell is dead, no point
    }// end if
    else{
        this.setAttribute('class', 'live');
        grid[column][row]=1; // cell is alive
    }// end else
}// end cellClick

var canvas= document.getElementById("gl-canvas");
function createTable(){

    var table=document.createElement('table');
    for(var i=0; i<columns; i++){
        var tr=document.createElement('tr'); //

        for(var j=0; j<rows; j++){

            var cell=document.createElement('td'); // cell is appended to every column whose elementid is td
            cell.setAttribute('id', i+'-'+j);
            cell.setAttribute('class', 'dead'); // initially all of cells are 0 or dead
            cell.onclick=cellClick; // make grid of dead classes 0 and live classes 1
            tr.appendChild(cell);
        }// end for j 
        table.appendChild(tr);
    }// end for i
    gridContainer.appendChild(table);
}// end createTable


function controlButtons(){
    var start=document.getElementById('start');
    start.onclick=function(){
        if(playing){
            playing=false;
            this.innerHTML='Continue';
        }// end if
        else{
            playing=true;
            this.innerHTML='Pause';
            computeGame();
        }// end else
    }; // end startButton

    var reset=document.getElementById('reset');
    reset.onclick=function(){
        
        playing=false;

        var start=document.getElementById('start');
        start.innerHTML='Start'; // in a case of pause or continue, set button always start
        clearTimeout(timer); // once reset button is clicked, cancels a previous timeout

        var cell_list=document.getElementsByClassName('live'); // get the list of live cells
        var cells=[]; // converting cell_list to an array to work on it
        
        for(var i=0; i<cell_list.length; i++){
            cells.push(cell_list[i]);
        }// end for i

        for(var i=0; i<cells.length; i++){
            cells[i].setAttribute('class', 'dead');
        }// end for i
        
        // reset grid
        for(var i=0; i<columns;i++){
            for(var j=0; j<rows; j++){
                grid[i][j]=0;
                next_grid[i][j]=0;
            }// end for j
        }// end for i 

    }// end reset

    var next=document.getElementById('next');
    next.onclick=function(){
        if(playing){
            play();
        }// end if
        else{
            playing=true;
        }
    }// end next

    var save=document.getElementById('save');
    save.onclick=function(){
        var seed = new Blob([JSON.stringify(grid)], {
            type: "application/json"
        }) // grid -> json -> file 
    
        var a = document.createElement("a"); 
        a.download = "seed.json"; // name of downloanded file
        a.href = URL.createObjectURL(seed); // its link
    
        a.click();
    }// end save

    var file=document.getElementById('file');
    file.onchange=function(){
        var files=target.files;
        var reader=new FileReader();

        reader.onload=function() {
            console.log(JSON.parse(this.result)); // shows the array in the console
            grid = JSON.parse(this.result);
        }

        if (files.length>0) {
            for(var i=0; i<files.length; i++){
                reader.readAsText(files[i]);
                //reader.JSON.grid(files[i]);
            }// end for
        }// end if 
        cellUpdate();

        /*
        let reader=new FileReader();

        if(file.length>0){
            reader.onload=()=>{
                this.grid=JSON.parse(reader.result);
                this.cellUpdate();
            };
            console.log(readAsText[files[0]]);
            reader.readAsText(files[0]);
        }
        */
    }// end file
    
    var alivecolor=document.getElementById("alivecolor"); //get alive color from td.live
    var deadcolor=document.getElementById("deadcolor");  //get dead color from td.dead

    alivecolor.onchange=function(e){
        document.documentElement.style.setProperty("--alive-color", e.target.value);
    }// change value of alive color through root

    deadcolor.onchange=function(e){
        document.documentElement.style.setProperty("--dead-color", e.target.value);
    }// change value of dead color through root

}// end controlButtons


function cellUpdate(){
    for(var i=0; i<columns; i++){
        for(var j=0; j<rows; j++){

            var cell=document.getElementById(i+'-'+j);
            if(grid[i][j]==1) cell.setAttribute('class', 'live'); // 1 means live cell
            else cell.setAttribute('class', 'dead'); // 0 means dead cell

        }// end for j
    }// end for i

}// end cellUpdate

function countNeighbours(column,row){
    var count=0;

    //there are 8 neighbours of a given grid. 
    // count the neughbours whose cell is 1 or live
    if(column-1 >=0){
        if(grid[column-1][row]==1) count++; 
    }// end if

    if(column-1 >=0 && row-1 >=0){
        if(grid[column-1][row-1]==1) count++;
    }// end if

    if(column-1 >=0 && row+1 <rows){
        if(grid[column-1][row+1]==1) count++;
    }// end if

    if(row-1 >=0){
        if(grid[column][row-1]==1) count++; 
    }// end if    

    if(row+1 <rows){
        if(grid[column][row+1]==1) count++; 
    }// end if

    if(column+1 <columns){
        if(grid[column+1][row]==1) count++; 
    }// end if

    if(column+1 <columns && row-1 >=0){
        if(grid[column+1][row-1]==1) count++;
    }// end if

    if(column+1 <columns && row+1 <rows){
        if(grid[column+1][row+1]==1) count++;
    }// end if    
    return count;
}// end countNeighbours

function rules(column,row){
    var number=countNeighbours(column,row); // number of neighbours of a cell

    // apply the rules of the game

    if(grid[column][row]==1){ // live cell
        if(number<2) next_grid[column][row]=0; //less than 2 live neighbours -> dies
        else if(number==2 || number==3) next_grid[column][row]=1; //with 2 or 3 live neighbours -> lives
        else if(number>3) next_grid[column][row]=0; // more than 3 -> dies
    }// end if 

    else if(grid[column][row]==0){ // dead cell
        if(number==3) next_grid[column][row]=1; // exactly 3 live neighbours -> lives
    }// end else if

}// end rules

function play(){
    for(var i=0; i<columns; i++){
        for(var j=0; j<rows; j++){
            rules(i,j);
        }// end for j
    }// end for i

    //transfer next_grid values to grid and reset next_grid for future values of grid
    for(var i=0; i<columns; i++){
        for(var j=0; j<rows; j++){
            grid[i][j]=next_grid[i][j];
            next_grid[i][j]=0;
        }// end for j
    }// end for i
    cellUpdate(); // giving live to the cell whose value is 1 
}// end play



var timer;
function computeGame(){
    play();
    var speed=document.getElementById('speed').value;
    if(playing){ //playing==true then compute the game
        if(speed) timer=setTimeout(computeGame, speed); // if speed has a value ->set a timer which executes a function once the timer expires
        else timer=setTimeout(computeGame, 100); // speed no value -> default value of speed
    }// end if
}// end computeGame


