const JobModel = require("../models/Job");
const {StatusCodes} =require("http-status-codes");
const {NotFoundError, BadRequestError} = require("../errors");
const getAllJobs = async (req,res)=>{
    const jobs = await JobModel.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req,res)=>{
    let {user:{userId},params:{id:jobId}} = req;

    let job = await JobModel.findOne({
        _id:jobId,
        createdBy:userId
    });

    if(!job)
    {
        throw new NotFoundError(`There is no job with that id:${jobId}`);
    }

    return res.status(StatusCodes.OK).json({job});


 }

const createJob = async (req,res)=>{
    req.body.createdBy = req.user.userId;
    let job = await JobModel.create(req.body);
     res.status(StatusCodes.CREATED).json({job});
}


const updateJob = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId },
    } = req

    console.log(company,position,userId,jobId);

    if (company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty')
    }
    const job = await JobModel.findByIdAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    )
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}


const deleteJob = async (req,res)=>{
   const {
       user:{userId,name},
       params:{id:jobId}
   } = req;


   let job = await JobModel.findByIdAndDelete({_id:jobId,createdBy:userId});
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json( );
}


module.exports ={
    getAllJobs,
    getJob,
    updateJob,
    deleteJob,
    createJob
}