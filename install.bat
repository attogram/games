@echo off

set name[0]=hextris
set  git[0]=https://github.com/Hextris/hextris.git

set name[1]=hexgl
set  git[1]=https://github.com/BKcore/HexGL.git
REM hexgl setup - some servers error on .htaccess ExpiresByType settings

set name[2]=particle-clicker
set  git[2]=https://github.com/particle-clicker/particle-clicker.git

set name[3]=html5-asteroids
set  git[3]=https://github.com/dmcinnes/HTML5-Asteroids.git

set name[4]=pond
set  git[4]=https://github.com/Zolmeister/pond.git

set name[5]=raging-gardens
set  git[5]=https://github.com/alunix/RagingGardensFB.git

set name[6]=polybranch
set  git[6]=https://github.com/gbatha/PolyBranch

REM set name[x]=dental-defender
REM set  git[x]=?.git

for /L %%x in (0,1,6) do (
    call echo ------------------------------------------------
    call echo Installing: %%name[%%x]%%
    call git clone %%git[%%x]%% %%name[%%x]%%
)

