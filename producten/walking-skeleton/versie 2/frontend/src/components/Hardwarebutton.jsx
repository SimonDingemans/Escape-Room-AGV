const HardwareButton = () => {
    return (
        <button onClick={(e) => handleSubmit(e)}>
            update devices
        </button>
    );
};

function handleSubmit(e) {
    e.preventDefault();

    fetch('http://localhost:8080/device', {
        method: 'POST',
    });

}

export default HardwareButton;