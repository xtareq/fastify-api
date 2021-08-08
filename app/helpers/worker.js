
const Queue = require('bee-queue')

const queue = new Queue("EMAIL_DELIVERY",{
    removeOnSuccess:true 
});


const work=(data)=>{
        let job = queue.createJob(data);
        job.save();
        return job

    }
      
queue.process((job, done) => {
    console.log("Job Started");
        
        if (done) {
            console.log("Job finished");
            return;
        }
});

module.exports.doLater = work


