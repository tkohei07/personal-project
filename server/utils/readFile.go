package utils

import (
	"fmt"
	"os"
	"path"
	"runtime"
)

func ReadSQLFile(dirFromCurDir string, filename string) (string, error) {
	_, currentFilePath, _, ok := runtime.Caller(1)
	if !ok {
		return "", fmt.Errorf("could not get the current file path")
	}

	currentDir := path.Dir(currentFilePath)
	sqlDir := path.Join(currentDir, dirFromCurDir)
	filePath := path.Join(sqlDir, filename)

	data, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}
	return string(data), nil
}
