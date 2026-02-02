        // import Swal from "sweetalert2";

        // export const alertSuccess = (title, text = "") =>
        // Swal.fire({
        //     icon: "success",
        //     title,
        //     text,
        //     timer: 1800,
        //     showConfirmButton: false,
        // });

        // export const alertError = (title, text = "") =>
        // Swal.fire({
        //     icon: "error",
        //     title,
        //     text,
        // });

        // export const alertInfo = (title, text = "") =>
        // Swal.fire({
        //     icon: "info",
        //     title,
        //     text,
        // });

        // export const alertConfirm = async ({
        // title = "Are you sure?",
        // text = "This action cannot be undone.",
        // confirmText = "Yes, continue",
        // }) => {
        // const result = await Swal.fire({
        //     icon: "warning",
        //     title,
        //     text,
        //     showCancelButton: true,
        //     confirmButtonText: confirmText,
        //     cancelButtonText: "Cancel",
        //     reverseButtons: true,
        // });

        // return result.isConfirmed;
        // };
    import Swal from "sweetalert2";

    // ✅ Success popup
    export const alertSuccess = (title, text = "") => {
    return Swal.fire({
        icon: "success",
        title,
        text,
        confirmButtonText: "OK",
    });
    };

    // ❌ Error popup
    export const alertError = (title, text = "") => {
    return Swal.fire({
        icon: "error",
        title,
        text,
        confirmButtonText: "OK",
    });
    };

    // ℹ️ Info popup
export const alertInfo = (title, message) => {
  Swal.fire({
    title,
    html: message,   // ✅ this renders HTML properly
    icon: "info",
    confirmButtonText: "OK",
  });
};


    // ⚠️ Confirm dialog (returns true/false)
    export const alertConfirm = async ({
    title = "Are you sure?",
    text = "This action cannot be undone.",
    confirmText = "Yes, continue",
    cancelText = "Cancel",
    } = {}) => {
    const res = await Swal.fire({
        icon: "warning",
        title,
        text,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
    });

    return res.isConfirmed;
    };

    // ✅ Toast (top-right small notification)
    export const toastSuccess = (title) => {
    return Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    });
    };

    export const toastError = (title) => {
    return Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
    });
    };


    export const confirmLogout = async () => {
    const result = await Swal.fire({
        title: "Log out?",
        text: "Are you sure you want to log out of your account?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, log out",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#aaa",
    });

    return result.isConfirmed;
    };