const form = document.getElementById("form");

form.addEventListener("submit", (event) => {

    event.preventDefault();

    const formdata = new FormData(form);

    const query = new FormProvider(formdata, "admin/createStore");
})