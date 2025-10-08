package com.org.export_to_excel.Controller;

import com.org.export_to_excel.Entity.Courses;
import com.org.export_to_excel.Service.CouserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    @Autowired
    public CouserService courseService;
    private Courses courses;

    @GetMapping("/excel")
    public void generateExcelReport(HttpServletResponse response) throws IOException {
        //responsible to download the exccel file
        response.setContentType("application/octet-stream");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=courses.xls";
        response.setHeader(headerKey, headerValue);
        courseService.generateExcel(response);
    }

//    @PostMapping("/save")
//    public ResponseEntity<Courses> saveCourses(@ResponseBody Courses courses) {;
//        return courseService.saveCourses(courses);
//
//    }

    @DeleteMapping("/delete/{id}")
    public void deleteCourse(@PathVariable Integer id) {
        courseService.deleteCourses(id);
    }

@PostMapping("/save")
public ResponseEntity<Courses> saveCourses(@RequestBody Courses courses) {
    Courses savedCourses = courseService.saveCourses(courses);
    return ResponseEntity.ok(savedCourses);
}
    @GetMapping
    public List<Courses> getCourses()  {
        return courseService.getAllCourses();
    }
}
