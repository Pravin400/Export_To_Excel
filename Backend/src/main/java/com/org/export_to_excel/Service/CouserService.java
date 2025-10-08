package com.org.export_to_excel.Service;

import com.org.export_to_excel.Entity.Courses;
import com.org.export_to_excel.Repository.CourseRepository;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouserService {

    private final CourseRepository courseRepository;

    public void generateExcel(HttpServletResponse response) throws IOException {
        List<Courses> courses = courseRepository.findAll();

        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet("Courses_Info");
        HSSFRow  row = sheet.createRow(0);//excel row index start from o to n;
        HSSFCell cell = row.createCell(0);//excel cell/column index start from o to n;
        row.createCell(0).setCellValue("ID");
        row.createCell(1).setCellValue("Course Name");
        row.createCell(2).setCellValue("Course Description");
        row.createCell(3).setCellValue("Course Price");

        //data index starrt from the 1 because 0 is already grabbed by the header
        int dataRowIndex = 1;

        for (Courses course : courses) {
            HSSFRow dataRow = sheet.createRow(dataRowIndex);
            dataRow.createCell(0).setCellValue(course.getId());
            dataRow.createCell(1).setCellValue(course.getCourseName());
            dataRow.createCell(2).setCellValue(course.getCourseDescription());
            dataRow.createCell(3).setCellValue(course.getPrice());
            dataRowIndex ++;
        }
        ServletOutputStream ops = response.getOutputStream();
        workbook.write(ops);
        workbook.close();
        ops.close();
    }

    public Courses saveCourses(Courses courses) {
       return courseRepository.save(courses);
    };

    public List<Courses> getAllCourses() {
        return courseRepository.findAll();
    }
//
//    public String  deleteCourses(Integer id) {
//        courseRepository.deleteById(id);
//        String str = "Courses Deleted Successfully!"+"{id}";
//        return str;
//    }

    public String deleteCourses(Integer id) {

        Courses course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + id));

        courseRepository.deleteById(id);

        return "Course '" + course.getCourseName() + "' deleted successfully!";
    }


    public Courses updateCourses(Integer id, Courses courses) {
        return courseRepository.save(courses);
    }

}
