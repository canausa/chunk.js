/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function chunk() {
    
    var g_count = 0;
    var g_total_chunks = 0;
    var g_file_count = 0;
    var files = new Array();
    
    /**
     * sendfiles
     * 
     * element object of the inputtype=file so that we can process the files for uploading.
     * upload_path A string containing the URL to which the request is sent.
     */
    this.sendFiles = function(element, upload_path){
        
        //console.log(element);
        g_file_count = element.files.length;
        for ( var i=0; i<g_file_count; i++) {
            var temp_file = new file_obj(element.files[i]);
            files.push(temp_file);
            g_total_chunks += temp_file.getNumChunks();
        }
        for ( i=0; i<files.length; i++) {
            files[i].send(upload_path);
        }
    };
    
    
    function file_obj(file) {
        
        const BYTES_PER_CHUNK = 1048576;
        const SIZE = file.size;
        var current_part = 1;
        var upload_path;
        var start = 0;
        var end = BYTES_PER_CHUNK;
        const num_chunks = Math.floor(SIZE / BYTES_PER_CHUNK) + 1;
        const file_name = file.name;
        
        function sendI(u_path) {
            upload_path = u_path;
            start = (current_part -1 ) * BYTES_PER_CHUNK;
            if ( start < SIZE ) {
            
                end = start + BYTES_PER_CHUNK;
                var chunk = file.slice(start, end);
                uploadChunk(chunk);
            }
        };
        
        this.send = function(u_path) {
            sendI(u_path);
        };
        
        this.getFileName = function() {
            return file_name;
        };
        this.getNumChunks = function() {
            return num_chunks;
        };
        this.getFileSize = function(){
            return SIZE;
        };
    
        function uploadChunk (chunk) {
        
            var fd = new FormData();
            fd.append("file", chunk, file_name);

            $.ajax({
                "url":upload_path+"?num="+current_part+"&total="+num_chunks,
                "type":"POST",
                "data": fd,
                "async": true,
                "contentType":false,
                "processData":false,
                "success": function () {
                    current_part=current_part+1;
                    sendI(upload_path);
                }
            });

        };
        
    };
};