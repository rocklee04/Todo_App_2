const express = require("express")

const noteRouter = express.Router()
const {NoteModel} = require("../model/Note.model")


noteRouter.post("/create",async (req, res) => {
    try {
        const note = new NoteModel(req.body)
        await note.save()
        res.status(200).send({"msg": "Note has been created"})
    } catch(err) {
        res.status(400).send({"msg": err.message})
    }
})


noteRouter.get("/",async (req, res) => {
    try{
        const notes = await NoteModel.find({authorID: req.body.authorID});
        res.status(200).send(notes);
    } catch(err) {
        res.send(400).send({"msg": err.message})
    }

}) 


noteRouter.patch("/update/:noteID",async (req, res) => {
    const {noteID} = req.params;
    const note = await NoteModel.findOne({_id: noteID})
    try{
        if(req.body.authorID !== note.authorID) {
            res.status(200).send("You are not an authorized user to do this action");
        }else {
            await NoteModel.findByIdAndUpdate({_id: noteID}, req.body);
            res.status(200).send({"msg": `the note with id:{${noteID} has been updated}`});
        }
        
    } catch(err) {
        res.send(400).send({"msg": err.message})
    }
}) 


noteRouter.delete("/delete/:noteID",async (req, res) => {
    const {noteID} = req.params;
    const note = await NoteModel.findOne({_id: noteID})

    try{
        if(req.body.authorID !== note.authorID) {
            res.status(200).send("You are not an authorized user to do this action");
        }else {  
            await NoteModel.findByIdAndDelete({_id: noteID});
            res.status(200).send("Notes data deleted");
        }
    } catch(err) {
        res.send(400).send({"msg": err.message})
    }
}) 

module.exports = {
    noteRouter
}