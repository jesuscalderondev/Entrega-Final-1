class Provider {
    host = "http://82.29.152.181:5000";
    charger = null;
    button = null;
    parameters = null;
    func = null;

    config = {
    };

    graphic = null;

    constructor(route, body, button, method, func, auth = false, parameters = {}, multiplatform = false) {

        const myHeaders = new Headers();

        this.charger = document.getElementById("charger");
        this.charger.style = 'display: block;';
        this.route = route;

        if (body != null) {
            body = (body instanceof FormData) ? body : JSON.stringify(body);
            this.config.body = body;
        }

        this.button = button;
        this.config.method = method;
        this.parameters = parameters;
        this.func = func;

        if (sessionStorage.getItem("token") != null) {
            myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("token"));
        }

        if (multiplatform) {
            myHeaders.append("Content-Type", "multipart/form-data")
        } else {
            myHeaders.append("Content-Type", "application/json");

        }


        this.config.headers = myHeaders;
    }

    operate() {

        console.log(this.config);
        fetch(this.host + this.route, this.config)

            .then(response => response.json())

            .then(data => {

                if ("error" in data) {
                    if ("T" == data.error[0]) {
                        alert(data.message);
                        console.log("Aquí está el error");

                        window.location = "index.html";
                    }

                } else {
                    this.parameters["data"] = data;
                    if (!(this.func == null)) {
                        this.graphic = this.func(this.parameters);
                    }
                }

            })

            .catch(error => {

                console.error(error);

                const colorIcon = "#e81400";
                const message = "No se pudo conectar al servidor";
                const toast = new Toast(colorIcon, message);
                toast.show();
            })

            .finally(() => {
                this.charger.style = 'display: none;';

                if (this.button != null) {
                    this.button.disabled = false;
                }

            });
    }

    getData() {
        return this.data;
    }
}

class FormProvider {

    constructor(formData, route, isJson = false, func = null) {


        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("token"));

        if (isJson) {
            myHeaders.append("Content-Type", "application/json")
        }

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData
        };

        fetch("http://82.29.152.181:5000/" + route, requestOptions)
            .then((response) => response.json())
            .then(data => {
                var color = "#005ff1";
                if ("error" in data) {
                    color = "#e81400";

                } else {
                    form.reset();

                    if (func != null) {
                        func();
                    }
                }

                const toast = new Toast(color, data["message"]);
                toast.show()

            })
            .catch(error => {
                const colorIcon = "#e81400";
                const message = "No se pudo conectar al servidor, no se enviaron los datos";
                const toast = new Toast(colorIcon, message);
                toast.show()
            })

    }
}