export default function mapToFormData(values){
  const formData = new FormData();

  Object.keys(values).forEach(key=>{
      formData.append(key,values[key])
  })

  return formData;

}
