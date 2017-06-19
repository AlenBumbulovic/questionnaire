angular.module('mop_config',['toastr'])

        //constants
    .constant('config',{
        apiUrl: 'http://localhost:3000'
    })


.config(['toastrConfig', function(toastrConfig) {

    // Toastr Configuration
    angular.extend(toastrConfig, {
        containerId: 'toast-container',
        newestOnTop: true,
        positionClass: 'toast-top-right',
        target: 'body',
        preventOpenDuplicates: true,
        progressBar: true
    });

}]);