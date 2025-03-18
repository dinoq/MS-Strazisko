$ProjektDir = ((Get-Item ((Get-Location).ToString())).FullName) + "\"

$Global:serverFolder = $ProjektDir+".filesForServer"
If (!(test-path $Global:serverFolder)) {
    New-Item -ItemType Directory -Force -Path $Global:serverFolder
    Write-Host "Creating folder"$Global:serverFolder
}


Remove-Item $Global:serverFolder\* -Recurse -Force
#TODO smazat ^, porovnávat hashe...

$excludedFilesAndDirectories = @(
    #Directories:
    ".compress"
    ".hidden"
    ".next"
    ".nginx"
    ".vscode"
    "database\database.db"
    ".filesForServer"
    "node_modules"
    "public\dokumenty"
    "public\img\albums"
    "public\navrh"

    
    #Files:
    "next-env.d.ts"
    "package-lock.json"
    "prepareToServer.ps1"
)

function loopDirectory { 
    param($path)

    $relativePath = $path.substring($ProjektDir.Length-1)
    
    if (!$relativePath.Contains("\")) {
        $relativePath = "\" + $relativePath
    }
    
    #Write-Host -ForegroundColor Yellow $relativePath
    if(!$excludedFilesAndDirectories.Contains($relativePath.Substring((1)))){
        if ((Get-Item $path) -is [System.IO.DirectoryInfo]) {
            $subItems = Get-ChildItem $path
            
            If (!(test-path $Global:serverFolder$relativePath)) {
                [void](New-Item -ItemType Directory -Force -Path $Global:serverFolder -Name $relativePath)
                Write-Host "Creating new Folder" $Global:serverFolder$relativePath
            }
    
            foreach ($subItem in $subItems) {
                loopDirectory $subItem.FullName
            }
        }
        elseif ((Get-Item $path) -is [System.IO.FileInfo]) {
            $dest = $Global:serverFolder + ($relativePath.substring(0, $relativePath.LastIndexOf('\')))
            $serverFile = $Global:serverFolder+$relativePath
            If (!(test-path $Global:serverFolder$relativePath)) {
                [void](Copy-Item $path -Destination $dest)
                Write-Host "Copying new file"(Split-Path $relativePath -leaf)"into"$dest
            }
            else {
                # Kontrola aktuálnosti souboru
                if ((Get-FileHash $path).hash -eq (Get-FileHash $serverFile).hash) {
                    Write-Host "Removing file"(Split-Path $relativePath -leaf)" (because it didn't change from last server update)"
                    Remove-Item $Global:serverFolder\$relativePath
                }else{
                    Write-Host "Actualizing file"(Split-Path $relativePath -leaf)" (destination:"$dest")"
                    [void](Copy-Item $path -Destination $dest)
                }
            }
        }
    }
}


loopDirectory $ProjektDir