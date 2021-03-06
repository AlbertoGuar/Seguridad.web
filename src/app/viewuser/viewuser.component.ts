import { Component, Type, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../model/usuario';
import { first } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EdituserComponent } from '../edituser/edituser.component';
import { DeleteusrComponent } from '../deleteusr/deleteusr.component';
import { ChangepswComponent } from '../changepsw/changepsw.component';
import { MatDialog} from '@angular/material/dialog';
import { AlertService, UsuarioService, RolService } from './../service';
import { AppSecurity } from '../app-security';

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html'
})

export class ViewuserComponent implements OnInit {
  isDisabled: boolean;
  public currentUser: Usuario;
  returnUrl: string;
  loading = false;
  rolessel= [];
  altausrrol: any =[];
  altausrrolr: any =[];
  public id: string;
  public isDeleted: string
  public officeId: string;
  public staffId: string
  public username: string;
  public firstname: string;
  public lastname: string;
  public password: string;
  public email: string;
  public firsttimeLoginRemaining: boolean;
  public nonexpired: boolean;
  public nonlocked: boolean;
  public nonexpiredCredentials: boolean;
  public enabled: boolean;
  public lastTimePasswordUpdated: Date;
  public passwordNeverExpires: boolean;
  public selfServiceUser: boolean

  constructor(
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService, 
    private rolService: RolService, 
    private security: AppSecurity, 
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private dialog: MatDialog,
    private alertService: AlertService
    ) {
    
      this.activatedRoute.params.subscribe( params =>{ 
        this.usuarioService.usuarioid(params['username'])
        .pipe(first())
        .subscribe(
            data => {
                this.currentUser = data;
                this.id = this.currentUser.id; 
                this.isDeleted = this.currentUser.isDeleted;
                this.officeId = this.currentUser.officeId;
                this.staffId = this.currentUser.staffId;
                this.username = this.currentUser.username;
                this.firstname = this.currentUser.firstname;
                this.lastname = this.currentUser.lastname; 
                this.password = this.currentUser.password; 
                this.email = this.currentUser.email;
                this.firsttimeLoginRemaining = this.currentUser.firsttimeLoginRemaining;
                this.nonexpired = this.currentUser.nonexpired;
                this.nonlocked = this.currentUser.nonlocked;
                this.nonexpiredCredentials = this.currentUser.nonexpiredCredentials;
                this.enabled = this.currentUser.enabled;
                this.lastTimePasswordUpdated = this.currentUser.lastTimePasswordUpdated;
                this.passwordNeverExpires = this.currentUser.passwordNeverExpires;
                this.selfServiceUser =this.currentUser.selfServiceUser
                this.consultaUserRoles();
                  },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });   
      })
  }

  ngOnInit(): void {
/*    this.isDisabled = false;
    this.consultaSecurity();
    */
  }

  consultaSecurity(){
    let actualizar = this.security.actualizausr();
    if (actualizar){
        if (!this.nonlocked){
          this.isDisabled = true;
        }
    }
  } // Cierre del método consultaSecurity

  consultaUserRoles() { 
    this.rolService.consuserrol(this.id)
    .pipe(first())
    .subscribe(
        data => {
          this.altausrrol = data;
          for (let i=0; i < this.altausrrol.length; i++){ 
            this.consultaRol(i);
          }
        },
        error => {
            this.alertService.error(error);
            this.loading = false;
        });
  } // Cierre del método consultaroles

  consultaRol(i) {
    this.rolService.rolconsid(this.altausrrol[i].roleId)
    .pipe(first())
    .subscribe(
        data => {
          this.altausrrolr = data;
          this.rolessel.push(this.altausrrolr);
          this.isDisabled = false;
          this.consultaSecurity();
        },
        error => {
            this.alertService.error(error);
            this.loading = false;
        });
  }


  iredituser(username:string): void {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/edituser';
      this.router.navigate([this.returnUrl,username]);         
  }

  deleteusr(): void {
    const dialogRef = this.dialog.open(DeleteusrComponent, {
      width: '400px',
      height: '200px',
      data: {username: this.username}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
    });
  }
  
  changepsw(): void {
    const dialogRef = this.dialog.open(ChangepswComponent, {
      width: '450px',
      height: '430px',
      data: {username: this.username}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
    });
  }  

  activarusr(){
    this.currentUser.nonlocked = true;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/usuarios';
    console.log ("activarusr")
    console.log(this.currentUser)
    this.usuarioService.edituser(this.currentUser)
    .pipe(first())
    .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
          this.loading = false;
        },
        error => {
           this.loading = false;
        });    
  } // Cierre del metodo activausr

} // Cierre del metodo principal

