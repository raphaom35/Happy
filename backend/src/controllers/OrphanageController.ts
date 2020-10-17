import {Request,Response} from 'express'
import {getRepository} from 'typeorm';
import Orphanage from '../models/Orphanage';
import OrphanageView from '../views/Orphanege_views'
import * as Ypu from 'yup'
export default {
  async index(request:Request,response:Response){
    const orphanagesRepository = getRepository(Orphanage)
    const orphanages = await orphanagesRepository.find({
      relations:['images']
    });
    return response.json(OrphanageView.renderMany(orphanages))
  },
  async show(request:Request,response:Response){
    const {id} =request.params ;
    const orphanagesRepository = getRepository(Orphanage)
    const orphanage = await orphanagesRepository.findOneOrFail(id,{
      relations:['images']
    });
    return response.json(OrphanageView.render(orphanage))
  },

  async create(request:Request,response:Response){
       
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    }=request.body;
    const orphanagesRepository = getRepository(Orphanage)
    const requestImage = request.files as Express.Multer.File[];
    const images = requestImage.map(image=>{
      return {path:image.filename}
    })
    const data ={
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    };
    const schema =Ypu.object().shape({
      name:Ypu.string().required('Nome obrigatorio'),
      latitude:Ypu.number().required('Latitude obrigatorio'),
      longitude:Ypu.number().required('Longitude obrigatorio'),
      about:Ypu.string().required('About obrigatorio').max(300),
      instructions:Ypu.string().required('Instructions obrigatorio'),
      opening_hours:Ypu.string().required('Opening_hours obrigatorio'),
      open_on_weekends:Ypu.bool().required('Open_on_weekends obrigatorio'),
      images:Ypu.array(Ypu.object().shape({
        path:Ypu.string().required()
      }))

    })
    await schema.validate(data,{
      abortEarly:false,
    })
    const orphanage = orphanagesRepository.create(data);
    await orphanagesRepository.save(orphanage)
    return response.status(201).json(orphanage)
  }
}