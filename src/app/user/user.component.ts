import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../httpservice.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private http: HttpClient,private apiService:ApiService) { }
  userinfo:any={};
  isadd:boolean=false;
  userlist:any=[];
  ngOnInit() {
      this.getdata();
  }

  onSubmit(form,data){
      if(form.invalid){
        return;
      }else{
        console.log(data._id);
        if(data._id=='' || data._id==undefined){
          this.apiService.addPerson(data)
          .subscribe((data:any) => {
            console.log(data)
            this.getdata();
            this.userinfo={};
            this.imagepath='';
            this.isadd=false;
            alert(data.message);
           
          },err=>{
            console.log(err);
            alert(err.error.message);
          })  
        }else{
          this.apiService.update(data,data._id)
          .subscribe((data:any) => {
            console.log(data)
            this.userinfo={};
            this.imagepath='';
            this.getdata();
            this.isadd=false;
            alert(data.message);
           
          },err=>{
            console.log(err);
            alert(err.error.message);
          })  
        }
        
        
      }
  }
  getdata(){
    this.apiService.getPeople()
    .subscribe((data:any) => {
      this.userlist=data.users;
      
    })      
  }
  edit(user){
      console.log(user);
      this.userinfo=user;
      this.isadd=true;
      console.log(user);
      this.imagepath='http://localhost:8000'+user.profilepic;
  }
  delete(user){
    this.apiService.deletedata(user._id)
    .subscribe((data:any) => {
      console.log(data)
      this.getdata();
      this.isadd=false;
      alert(data.message);
     
    })  
  }
  imagepath:any='';
  uploadprofile(event){
    console.log(event.target.files[0].type);
      if(event.target.files[0].type!="image/jpeg" && event.target.files[0].type!="image/png"){
          alert("only jpg or png file");
    }else if(event.target.files[0].size>4000000){
        alert("file not greater than 4 mb");
    }else{
      this.apiService.uploaddata(event.target.files[0])
      .subscribe((data:any) => {
        alert(data.message);
        console.log(data.data.path);
        this.userinfo.profilepic=data.data.path;
        console.log('http://localhost:8000'+this.userinfo.profilepic);
        this.imagepath='http://localhost:8000'+this.userinfo.profilepic;
      },err=>{
        console.log(err);
        alert(err.error.message);
      })  
    }
  }
  reset(){
    this.userinfo={};
    this.imagepath='';
  }
}
