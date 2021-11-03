$ProjektDir = ((Get-Item ((Get-Location).ToString())).FullName) + "\"

$serverFolder = "filesForServer"
If (!(test-path $serverFolder)) {
    New-Item -ItemType Directory -Force -Path . -Name $serverFolder
    Write-Host "Creating folder"$serverFolder
}

$includedFilesAndDirectories = @(
    #Dirs:
    "components"
    "pages"
    "public"
    "src"
    "styles"

    #Files:
    "next.config.js"
    "package.json"
    "tsconfig.json"
)

$excludedFilesAndDirectories = @(
    "\public\dokumenty"
    "\public\navrh"
    "\public\img\albums"
)

function loopDirectory { 
    param($path)

    $relativePath = $path.substring($ProjektDir.Length-1)
    
    if (!$relativePath.Contains("\")) {
        $relativePath = "\" + $relativePath
    }
    
    #Write-Host -ForegroundColor Yellow $relativePath

    if ((Get-Item $path) -is [System.IO.DirectoryInfo] -and !$excludedFilesAndDirectories.Contains($relativePath)) {
        $subItems = Get-ChildItem $path
        
        If (!(test-path $ProjektDir$serverFolder$relativePath)) {
            [void](New-Item -ItemType Directory -Force -Path $ProjektDir$serverFolder -Name $relativePath)
            Write-Host "Creating new Folder" $ProjektDir$serverFolder$relativePath
        }

        foreach ($subItem in $subItems) {
            loopDirectory $subItem.FullName
        }
    }
    elseif ((Get-Item $path) -is [System.IO.FileInfo] -and !$excludedFilesAndDirectories.Contains($relativePath)) {
        $dest = $ProjektDir + $serverFolder + ($relativePath.substring(0, $relativePath.LastIndexOf('\')))
        $serverFile = $ProjektDir+$serverFolder+$relativePath
        #Write-Host -ForegroundColor Green $serverFile
        If (!(test-path $ProjektDir$serverFolder$relativePath)) {
            #New-Item -ItemType Directory -Force -Path $ProjektDir$serverFolder -Name $relativePath
            #Write-Host "copy" (Get-FileHash $path).Hash
            [void](Copy-Item $path -Destination $dest)
            Write-Host "Copying new file"(Split-Path $relativePath -leaf)"into"$dest
        }
        else {
            # Kontrola aktuálnosti souboru
            if ((Get-FileHash $path).hash -ne (Get-FileHash $serverFile).hash) {
                Write-Host "Actualizing file"(Split-Path $relativePath -leaf)" (destination:"$dest")"
                [void](Copy-Item $path -Destination $dest)
            }
        }
    }
}


foreach ($dir in $includedFilesAndDirectories) {
    loopDirectory $ProjektDir$dir
}