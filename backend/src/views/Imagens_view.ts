import Imgage from '../models/Image'
export default {
  render(image: Imgage){
    return {
      id: image.id,
      url:`http://localhost:3333/uploads/${image.path}`
     
    };
  },
  renderMany(images: Imgage[]){  
        return images.map(image => this.render(image))
  }
}