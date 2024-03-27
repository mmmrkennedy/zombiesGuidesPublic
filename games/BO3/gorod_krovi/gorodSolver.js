function init_data(){
    let output_table = [[]]

    
}


try {
    document.getElementById("calculateButton").addEventListener("click", function () {
        const greenValve = document.getElementById("greenValve").value;
        const pinkValve = document.getElementById("pinkValve").value;

        let newResult;
        
        if(greenValve === pinkValve){
            let newResult = "Locations cannot be the same"
        }
        
        const resultElement = document.getElementById("result");
        resultElement.innerHTML = `Result: ${newResult}`;
    });
} catch (error){
    console.log("")
}
